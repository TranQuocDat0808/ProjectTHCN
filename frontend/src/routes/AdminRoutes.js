import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = () => {
    const token = localStorage.getItem("token");  // Lấy token từ localStorage

    if (!token) {
        // Nếu không có token, chuyển hướng tới trang đăng nhập
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role !== "admin") {
            // Nếu vai trò không phải admin, chuyển hướng về trang đăng nhập
            alert("Bạn không có quyền truy cập")
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        // Nếu token không hợp lệ hoặc hết hạn, chuyển hướng về trang đăng nhập
        return <Navigate to="/" replace />;
    }

    // Nếu token hợp lệ và người dùng là admin, cho phép truy cập vào route
    return <Outlet />;
};

export default PrivateRoute;