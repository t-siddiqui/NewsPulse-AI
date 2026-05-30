const express = require('express');
const router = express.Router();
const multer = require('multer');
// Direct internal import avoids the buggy entry point that loads test data on require
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

// Store in memory, no disk writes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'text/plain'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and TXT files are allowed'));
        }
    }
});

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let extractedText = '';

        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            extractedText = data.text;
        } else {
            // Plain text file
            extractedText = req.file.buffer.toString('utf-8');
        }

        // Clean up whitespace
        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        if (!extractedText || extractedText.length < 10) {
            return res.status(400).json({ error: 'Could not extract readable text from file' });
        }

        // Trim to 5000 chars max for analysis
        const trimmedText = extractedText.slice(0, 5000);

        res.json({
            text: trimmedText,
            totalLength: extractedText.length,
            filename: req.file.originalname
        });

    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).json({ error: err.message || 'Failed to process file' });
    }
});

module.exports = router;
