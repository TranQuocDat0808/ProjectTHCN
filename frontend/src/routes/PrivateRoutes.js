import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (!token) {
        // Nếu không có token, hiển thị thông báo và chuyển hướng tới trang đăng nhập
        alert("Bạn cần đăng nhập để đọc sách!");
        return <Navigate to="/login" replace />;
    }

    // Nếu có token, cho phép truy cập vào route
    return <Outlet />;
};

export default PrivateRoute;