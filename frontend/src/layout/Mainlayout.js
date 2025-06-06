import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";

const MainLayout = () => {
    const location = useLocation();

    // Kiểm tra nếu đang ở trang đọc sách hoặc trang About
    const isBookReaderPage = location.pathname.includes('/read/') ||
                            location.pathname.includes('/about');

    return (
        <>
            <Header />
            <main style={{ display: "flex", marginTop: "80px" }}>
                {/* Ẩn Sidebar nếu đang ở trang đọc sách hoặc trang About */}
                {!isBookReaderPage && <Sidebar />}
                <Outlet />
            </main>
            {/* Chỉ hiển thị Footer nếu không phải trang đọc sách */}
            {!isBookReaderPage && <Footer />}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
        </>
    );
};

export default MainLayout;
