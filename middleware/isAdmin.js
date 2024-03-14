const isAdmin = (req, res, next) => {
    // Check if user is an admin (e.g., check if user role is 'admin')
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to next middleware
    } else {
        res.status(403).send('Forbidden'); // User is not an admin, send 403 Forbidden status
    }
};