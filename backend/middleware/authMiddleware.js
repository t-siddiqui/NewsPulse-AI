const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

const authMiddleware = (req, res, next) => {
    // Optional Auth: If there's no token, just proceed as guest
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        // If token is invalid, proceed as guest
        req.user = null;
        next();
    }
};

module.exports = authMiddleware;
