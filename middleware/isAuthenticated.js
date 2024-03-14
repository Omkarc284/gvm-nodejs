const isAuthenticated = (req, res, next) => {
    // Check if user is authenticated (e.g., check if user is logged in)
    if (req.user) {
        next(); // User is authenticated, proceed to next middleware
    } else {
        res.status(401).send('Unauthorized'); // User is not authenticated, send 401 Unauthorized status
    }
};