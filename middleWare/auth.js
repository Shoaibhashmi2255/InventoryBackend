

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role; // Assuming `req.user` is populated after JWT verification
        if (allowedRoles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({ message: 'Access denied' });
    };
};

module.exports = { authorize };
