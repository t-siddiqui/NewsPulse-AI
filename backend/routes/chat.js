const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: 'Groq API key is missing in backend.' });
        }

        const messages = [
            {
                role: 'system',
                content: `You are NewsPulse AI, a friendly and knowledgeable assistant focused on helping people understand and fight fake news.

Your purpose is to:
- Educate users about why detecting fake news is critical in today's world
- Explain how misinformation spreads and the harm it causes
- Help users critically evaluate news and media they read
- Guide users on how to use this platform to scan articles for misinformation
- Discuss real-world examples of misinformation and their impact

Keep your responses conversational, clear, and helpful. Do not mention specific AI models or technical infrastructure. Focus on the user's need to identify and avoid fake news. Use bullet points when listing things. Keep responses concise.`
            }
        ];

        // Add history
        if (history && history.length > 0) {
            history.forEach(msg => {
                messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages,
                temperature: 0.7,
                max_tokens: 512
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
        res.json({ reply });

    } catch (error) {
        console.error('Chatbot API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate response from AI' });
    }
});

module.exports = router;
