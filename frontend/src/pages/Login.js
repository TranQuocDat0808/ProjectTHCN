import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';

const Login = () => {
    // Khai báo các state để lưu trữ thông tin đăng nhập
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            // Gửi yêu cầu đăng nhập đến API backend
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Đăng nhập thất bại"); 
            }

            // Lưu token và thông tin người dùng vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Hiển thị thông báo thành công
            toast.success("Đăng nhập thành công!");
            navigate("/"); 

        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        }
    };

    return (
        <div>
            <div className="login-container">
                <div className="login-box">
                    <h2>Đăng Nhập</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Nhập email của bạn"
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
                            />
                        </div>
                        <button type="submit" className="login-button">
                            Đăng Nhập
                        </button>
                    </form>
                    <div className="login-footer">
                        <p>
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
