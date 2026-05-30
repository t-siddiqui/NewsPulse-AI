const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ResetToken = require('../models/ResetToken');

const createTransporter = () => nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Always return 200 so we don't leak if email exists
        if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

        const token = crypto.randomBytes(32).toString('hex');
        
        // Save token to DB (auto-expires after 30 minutes via TTL index)
        await ResetToken.create({ userId: user._id, token });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"NewsPulse" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: '🔐 Reset Your NewsPulse Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; border-radius: 16px; color: #f1f5f9;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #818cf8; font-size: 24px; margin: 0;">🧠 NewsPulse</h1>
                        <p style="color: #94a3b8; margin-top: 8px;">AI-Powered Fake News Detection</p>
                    </div>
                    <h2 style="color: #f1f5f9; font-size: 20px;">Reset Your Password</h2>
                    <p style="color: #94a3b8; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to create a new password. This link expires in <strong style="color: #f1f5f9;">30 minutes</strong>.
                     </p>
                    <a href="${resetLink}" style="display: block; text-align: center; margin: 24px 0; padding: 14px 32px; background: #6366f1; color: white; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px;">
                        Reset Password →
                    </a>
                    <p style="color: #64748b; font-size: 12px; text-align: center;">
                        If you did not request this, please ignore this email. Your password will remain unchanged.
                    </p>
                </div>
            `
        });

        res.json({ message: 'If that email exists, a reset link has been sent.' });

    } catch (error) {
        console.error('Forgot Password Error:', error.message, error.responseCode || '', error.response || '');
        res.status(500).json({ error: 'Failed to send reset email. Check your GMAIL_APP_PASSWORD in .env' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password, newPassword } = req.body;
        const finalPassword = newPassword || password;

        // Query token from database
        const record = await ResetToken.findOne({ token });
        if (!record) {
            return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
        }

        const hashed = await bcrypt.hash(finalPassword, 10); // Standardized to 10 rounds matching registration
        await User.findByIdAndUpdate(record.userId, { password: hashed });
        
        // Remove token after use
        await ResetToken.deleteOne({ _id: record._id });

        res.json({ message: 'Password reset successfully. You can now log in.' });

    } catch (error) {
        console.error('Reset Password Error:', error.message);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});

module.exports = router;
