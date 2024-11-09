const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and attach decoded user data to the request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Send error response if token is invalid or expired
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
