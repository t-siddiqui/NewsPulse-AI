const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const he = require('he');
const History = require('../models/History');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/predict - Run news analysis
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { text, url } = req.body;

        // PREVENT 400 ERROR: Catch short inputs before they reach Python
        if ((!text || text.trim().length < 15) && !url) {
            return res.status(400).json({ error: 'Input cannot be empty. Please provide a news article of at least 15 characters.' });
        }

        // HTML/XSS Sanitization using 'he' library
        const sanitizedText = text ? he.encode(text) : "";

        // Call FastAPI ML Service with defined timeout
        const mlUrl = process.env.FLASK_API_URL || 'http://localhost:5001';
        const mlResponse = await axios.post(`${mlUrl}/predict`,
            { text: sanitizedText, url: url || "" },
            { timeout: 15000 }
        );

        let { prediction, confidence, reasons, highlights, analyzed_url, extracted_text, fact_check_results } = mlResponse.data;

        // LLM Fact-Checking (Groq/Llama) with Web Search Context
        if (process.env.GROQ_API_KEY) {
            try {
                const inputText = extracted_text || sanitizedText || '';

                // Formulate search context string
                let contextString = "None available";
                if (fact_check_results && fact_check_results.length > 0) {
                    contextString = fact_check_results.map((r, i) => `[Source ${i + 1}] Title: ${r.title}\nContent: ${r.body}\nURL: ${r.href}`).join("\n\n");
                }

                const prompt = `You are a factual verification assistant. Determine if the factual claim in the input text is TRUE or FALSE.
If the Web Search Context is "None available", use your internal knowledge. If you cannot confidently prove the text is false, you MUST output true to avoid false positives.

Input Text to check: "${inputText.substring(0, 500)}"
DuckDuckGo Web Search Context:
${contextString}

Respond ONLY in valid JSON format: {"is_factual": boolean, "explanation": "string"}`;

                const groqResponse = await axios.post(
                    'https://api.groq.com/openai/v1/chat/completions',
                    {
                        model: 'llama-3.3-70b-versatile',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.1
                    },
                    { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` } }
                );

                const responseContent = groqResponse.data.choices[0].message.content;
                const cleanJson = responseContent.replace(/```json|```/g, "").trim();
                const assessment = JSON.parse(cleanJson);

                // Override Logic if LLM disagrees with ML
                if (assessment.is_factual === false) {
                    prediction = 'FAKE';
                    reasons.unshift(`Fact-Check Alert: ${assessment.explanation}`);
                }
            } catch (llmErr) {
                console.error("LLM Fact-check failed, sticking with ML prediction:", llmErr.message);
            }
        }

        // Save to DB
        const newHistory = new History({
            user: req.user ? req.user.id : null,
            text: extracted_text || sanitizedText,
            url: analyzed_url,
            prediction,
            confidence,
            reasons,
            highlights
        });
        await newHistory.save();

        res.json({
            _id: newHistory._id,
            prediction,
            confidence,
            reasons,
            highlights,
            analyzed_url,
            timestamp: newHistory.timestamp
        });

    } catch (error) {
        console.error('Prediction Flow Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: 'The AI service is currently busy or the input was invalid.' });
    }
});

// GET /api/predict/history - Retrieve user predictions history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authorization token required to view history.' });
        }
        const { page = 1, limit = 5, search } = req.query;
        const query = { user: req.user.id };

        if (search) {
            query.text = { $regex: search, $options: 'i' };
        }

        const history = await History.find(query)
            .sort({ timestamp: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const totalCount = await History.countDocuments(query);

        res.json({
            data: history,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            currentPage: parseInt(page),
            totalCount
        });
    } catch (error) {
        console.error('Fetch history error:', error);
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

// GET /api/predict/analytics - Retrieve analytics metrics
router.get('/analytics', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authorization token required to view analytics.' });
        }

        const stats = await History.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: "$prediction", count: { $sum: 1 } } }
        ]);

        let realCount = 0;
        let fakeCount = 0;

        stats.forEach(item => {
            if (item._id === 'REAL') realCount = item.count;
            if (item._id === 'FAKE') fakeCount = item.count;
        });

        const totalScans = realCount + fakeCount;
        const fakeRatio = totalScans > 0 ? Math.round((fakeCount / totalScans) * 100) : 0;

        // We construct weekly data for charts to populate the frontend dashboard
        const weeklyHistory = await History.find({ user: req.user.id })
            .sort({ timestamp: 1 })
            .limit(100);

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayStats = {};
        daysOfWeek.forEach(d => { dayStats[d] = { real: 0, fake: 0 }; });

        weeklyHistory.forEach(item => {
            const day = daysOfWeek[new Date(item.timestamp).getDay()];
            if (item.prediction === 'REAL') dayStats[day].real += 1;
            if (item.prediction === 'FAKE') dayStats[day].fake += 1;
        });

        const weeklyData = daysOfWeek.map(day => ({
            name: day,
            real: dayStats[day].real,
            fake: dayStats[day].fake
        }));

        res.json({
            totalScans,
            fakeCount,
            realCount,
            ratio: fakeRatio,
            weeklyData
        });
    } catch (error) {
        console.error('Fetch analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
});

// DELETE /api/predict/:id - Remove a history log
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authorization token required.' });
        }

        const scan = await History.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!scan) {
            return res.status(404).json({ error: 'History item not found or unauthorized.' });
        }

        res.json({ message: 'History item deleted successfully' });
    } catch (error) {
        console.error('Delete history error:', error);
        res.status(500).json({ error: 'Failed to delete history item.' });
    }
});

// GET /api/predict/:id - Retrieve specific prediction details
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authorization token required.' });
        }

        const scan = await History.findOne({ _id: req.params.id, user: req.user.id });
        if (!scan) {
            return res.status(404).json({ error: 'History item not found.' });
        }

        res.json(scan);
    } catch (error) {
        console.error('Fetch scan item error:', error);
        res.status(500).json({ error: 'Failed to fetch scan details.' });
    }
});

module.exports = router;