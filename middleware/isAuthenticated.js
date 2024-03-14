const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');

const isAuthorized = (roles) => async (req, res, next) => {
  try {
    // ExtractJWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SECRET);
    
    // Find the user in the database based on the decoded user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists and has one of the specified roles
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If user is authorized, set user in request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // If token is invalid or not provided, return 401 Unauthorized
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { isAuthorized };
