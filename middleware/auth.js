const jwt =  require('jsonwebtoken');
const config = require('config');

const verifyToken = (req, res, next) => {
    // Get token from the header
    const token = req.header('x-auth-token');

    // Check if token is present
    if(!token) {
        return res.status(401).json(
            {
                msg: 'No token, authorizartion denied'
            }
        );
    };

    // Token Verification
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status.json(
            {
                msg: "Token is not valid"
            }
        );
    };
};

module.exports = { verifyToken };