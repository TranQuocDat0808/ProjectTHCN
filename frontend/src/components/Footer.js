import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <img src="/images/logo.svg" alt="Logo" className="header-logo-item-icon" 
                height='60px' width='auto' />
                    <span className="footer-title">Thư Viện Số</span>
                </div>
                <div className="footer-links">
                    <a href="/">Trang chủ</a>
                    <a href="/about">Giới thiệu</a>
                    <a href="/books">Thư Viện</a>
                </div>
                <div className="footer-contact">
                    <p><strong>Email:</strong> fpsis@fpt.com</p>
                    <p><strong>Hotline:</strong> 0123 456 789</p>
                    <p><strong>Địa chỉ:</strong> KCX Tân Thuận P.Tân Thuận Đông, Quận 7, TP.HCM</p>
                </div>
                <div className="footer-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" />
                    </a>
                    <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zalo.svg" alt="Zalo" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" />
                    </a>
                </div>
            </div>
            <div className="footer-copy">
                © 2025 Thư Viện Số. Đã đăng ký bản quyền.
            </div>
        </footer>
    );
};

export default Footer;