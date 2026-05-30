const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/news?interests=AI,sports,India
router.get('/', async (req, res) => {
    try {
        const { interests } = req.query;
        if (!interests) return res.status(400).json({ error: 'Please provide interests.' });

        if (!process.env.NEWS_API_KEY) {
            return res.status(500).json({ error: 'NEWS_API_KEY not configured.' });
        }

        const query = interests.split(',').map(i => i.trim()).filter(Boolean).join(' OR ');

        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: query,
                apiKey: process.env.NEWS_API_KEY,
                pageSize: 12,
                sortBy: 'publishedAt',
                language: 'en',
            }
        });

        const articles = (response.data.articles || []).filter(a => a.title && a.title !== '[Removed]');
        res.json({ articles });

    } catch (error) {
        console.error('News API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch news articles.' });
    }
});

module.exports = router;
