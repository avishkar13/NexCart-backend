const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  // console.log('Token received:', req.headers['authorization']);

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
    
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  const decoded = jwt.decode(token);
// console.log(decoded); 

};




module.exports = authenticate;


