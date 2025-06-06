const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({
            where: {
                email: email,
                is_active: true
            }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Kiểm tra mật khẩu hợp lệ
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Tạo token JWT
        const token = jwt.sign(
            {
                userId: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Cập nhật thời gian đăng nhập cuối
        await user.update({ last_login: new Date() });

        // Gửi phản hồi dưới dạng JSON
        return res.json({
            status: 'success',
            token,
            user: {
                id: user.user_id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi server'
        });
    }
};


//Đăng Ký
const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            full_name: fullName,
            email: email,
            password: hashedPassword,
            role: 'user',
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            user: {
                id: newUser.user_id,
                email: newUser.email,
                fullName: newUser.full_name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

module.exports = {
    login,
    register
};
