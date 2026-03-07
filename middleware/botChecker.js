const botChecker = (req, res, next) => {
    const userAgent = req.headers['user-agent'];

    // 1. Block requests with no User-Agent
    if (!userAgent) {
        return res.status(403).json({ message: 'Forbidden: Missing User-Agent header.' });
    }

    // 2. Block known bot signatures
    const botPatterns = [
        'curl', 'wget', 'python-requests', 'bot', 'spider', 'crawler', 'scraper',
        'postmanruntime', 'axios', 'node-fetch', 'got', 'http-client', 'httpclient'
    ];

    const isBot = botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern));

    if (isBot) {
        // You can conditionally allow certain tools in development via .env
        if (process.env.NODE_ENV === 'development' && userAgent.toLowerCase().includes('postmanruntime')) {
            return next();
        }
        
        console.warn(`Blocked potential bot request: ${userAgent} from IP ${req.ip}`);
        return res.status(403).json({ message: 'Forbidden: Automated requests are not allowed.' });
    }

    next();
};

module.exports = botChecker;
