import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import axios from 'axios';  // Đảm bảo đã import axios

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
        if (password !== confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                fullName,
                email,
                password
            });

            if (response.data.success) {
                // Xử lý khi đăng ký thành công
                alert('Đăng ký thành công');
                navigate("/login"); 
            }
        } catch (error) {
            // Xử lý khi có lỗi
            setError('Có lỗi xảy ra khi đăng ký.');
        }
    };

    return (
        <div>
            <div className="register-container">
                <div className="register-box">
                    <h2>Đăng Ký Tài Khoản</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="full_name">Họ và Tên</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Nhập email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Nhập mật khẩu"
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                        <button type="submit" className="register-button">
                            Đăng Ký
                        </button>
                    </form>
                    <div className="register-footer">
                        <p>
                            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
