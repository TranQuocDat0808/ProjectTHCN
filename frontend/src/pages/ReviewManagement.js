import React, { useState, useEffect } from 'react';
import '../styles/AdminBooks.css';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(8);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đánh giá:', error);
        }
    };

    const deleteReview = async (reviewId) => {
        if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Xóa đánh giá thành công');
                    fetchReviews();
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Có lỗi xảy ra khi xóa đánh giá');
                }
            } catch (error) {
                alert('Không thể kết nối tới server');
            }
        }
    };

    // Lọc đánh giá theo search term
    const filteredReviews = reviews.filter(review =>
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tính toán phân trang
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Quản Lý Thông Tin Đánh Giá</h1>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên khách hàng, tên sách, nội dung..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="books-table reviews-table">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Tên User</th>
                            <th style={{ width: '20%' }}>Tên Sách</th>
                            <th style={{ width: '35%' }}>Đánh Giá</th>
                            <th style={{ width: '8%' }}>Sao</th>
                            <th style={{ width: '12%' }}>Ngày Đánh Giá</th>
                            <th style={{ width: '10%' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReviews.map((review) => (
                            <tr key={review.review_id}>
                                <td className="truncate-text">{review.name}</td>
                                <td className="truncate-text">{review.title}</td>
                                <td className="wrap-text">{review.comment}</td>
                                <td className="center-text">
                                    <div className="rating-stars">
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} style={{ color: index < review.rating ? '#FFD700' : '#D1D5DB' }}>
                                                {index < review.rating ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="center-text">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </td>
                                <td className="center-text">
                                    <button 
                                        onClick={() => deleteReview(review.review_id)}
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

export default ReviewManagement;