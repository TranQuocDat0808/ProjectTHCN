import React, { useState, useEffect } from 'react';
import '../styles/AdminBooks.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Xóa người dùng thành công!');
                    fetchUsers();
                }
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                alert('Có lỗi xảy ra khi xóa người dùng!');
            }
        }
    };

    // Lọc users theo search term
    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tính toán phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Quản Lý Thông Tin User</h1>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, vai trò..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="books-table">
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Tên</th>
                            <th style={{ width: '30%' }}>Email</th>
                            <th style={{ width: '20%' }}>Mật Khẩu</th>
                            <th style={{ width: '15%' }}>Vai Trò</th>
                            <th style={{ width: '10%' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(user.user_id)}
                                        className="delete-btn"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="page-btn"
                >
                    Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default UserManagement;