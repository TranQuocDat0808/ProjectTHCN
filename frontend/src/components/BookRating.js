import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/BookRating.css';

const BookRating = ({ bookId }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [titleBook, setTitleBook] = useState('');
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchReviews();
        fetchBookById();
    }, [bookId]);

    const fetchBookById = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
            if (!response.ok) {
                throw new Error('Không tìm thấy sách');
            }
            const data = await response.json();

            setTitleBook(data?.title);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sách:", error);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating((totalRating / reviews.length).toFixed(1)); 
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/books/${bookId}/reviews`);
            const data = await response.json();
            console.log(data);

            setReviews(data); 
            calculateAverageRating(data);
        } catch (error) {
            console.error('Lỗi khi lấy đánh giá:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault(); 
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!rating || !comment) {
            alert('Vui lòng cung cấp điểm đánh giá và bình luận');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: bookId,
                    userId: user.id,
                    rating: rating,
                    comment: comment,
                    title: titleBook,
                    name: user.fullName
                }),
            });
            if (response.ok) {
                setRating(0);    
                setComment('');   
                fetchReviews();    
            } else {
                // Nếu phản hồi từ server không ok, in thông báo lỗi
                const errorData = await response.json();
                console.error('Lỗi từ server:', errorData.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error); 
        }
    };

    return (
        <div className="book-rating">
            {/* Form đánh giá */}
            <div className="rating-form">
                <h3>Đánh giá sách</h3>
                <div className="stars">
                    {[...Array(5)].map((_, index) => (
                        <label key={index}>
                            <input
                                type="radio"
                                name="rating"
                                value={index + 1}
                                onClick={() => setRating(index + 1)}
                            />
                            <FaStar
                                className="star"
                                color={index < (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                onMouseEnter={() => setHover(index + 1)}
                                onMouseLeave={() => setHover(0)}
                            />
                        </label>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập đánh giá của bạn..."
                />
                <button className="submit-review-btn" onClick={handleSubmitReview}>
                    Gửi đánh giá
                </button>
            </div>
            {/* Danh sách các đánh giá từ người dùng */}
            <div className="reviews-list">
                {reviews?.length > 0 ? reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-stars">
                            <h3>{review.full_name}</h3>
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className="star"
                                    color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                                />
                            ))}
                        </div>
                        <p>{review.comment}</p>
                        <small>{new Date(review.created_at).toLocaleDateString()}</small>
                    </div>
                )) : <p>Chưa có đánh giá nào.</p>}
            </div>
        </div>
    );
};

export default BookRating;
