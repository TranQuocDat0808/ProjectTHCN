const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Không tìm thấy token xác thực' 
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Token không hợp lệ hoặc đã hết hạn' 
        });
    }
};

module.exports = {
    verifyToken
};