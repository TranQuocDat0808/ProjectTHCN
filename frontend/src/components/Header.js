import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Header.css";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Đăng xuất thành công!"); 
        setIsLoggedIn(false);
    };

    return (
        <nav className="header">
            <Link to="/" className="header-img">
                <img src="/images/logo.svg" alt="Logo" className="header-logo-item-icon" 
                height='40px' width='auto' />
            </Link>
            <Link to="/" className="header-logo">
                THƯ VIỆN SỐ
            </Link>

            <div className="header-menu">
                <div className="header-menu-item">
                    <Link to="/admin">ADMIN</Link>
                    <Link to="/">TRANG CHỦ</Link>
                    <Link to="/about">GIỚI THIỆU</Link>
                    <div className="dropdown">
                        <Link to="/books" className="dropdown-trigger">
                            THƯ VIỆN <i className="fas fa-chevron-down"></i>
                        </Link>
                        <div className="dropdown-content">
                            <Link to="/books">Sách Điện Tử</Link>
                            <Link to="/audiobooks">Sách Nói Audio</Link>
                        </div>
                    </div>
                </div>

                <div className="header-login">
                    {isLoggedIn ? (
                        <button onClick={handleLogout}>ĐĂNG XUẤT</button> 
                    ) : (
                        <Link to="/login">ĐĂNG NHẬP</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
