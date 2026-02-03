const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token (format: "Bearer TOKEN_HERE")
    const token = authHeader.replace('Bearer ', '');

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Add user ID to request
    req.userId = decoded.userId;

    // 4. Continue to next middleware/route
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;