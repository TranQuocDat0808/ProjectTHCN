import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookDetail.css';
import BookRating from '../components/BookRating';
import { FaStar } from 'react-icons/fa';

const BookDetail = () => {
    const bookID = useParams();
    const [book, setBook] = useState();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra thông tin người dùng từ localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
        }

        const fetchBookById = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/books/${bookID?.id}`);
                if (!response.ok) {
                    throw new Error('Không tìm thấy sách');
                }
                const data = await response.json();
                console.log(data);

                setBook(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sách:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookById();
    }, [bookID]);

    if (loading) return <div className="loading">Đang tải...</div>;
    if (!book) return <div className="error">Không tìm thấy sách</div>;

    const haldReadBook = () => {
        navigate(`/read/${bookID.id}`);
    }


    return (
        <div className="book-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ❮ Quay lại
            </button>
            <div className="book-detail-wrapper">
                <img src={book.image_url} alt={book.title} className='book_detail-img' />
                <div className="book-detail-content">
                    <div className="book-rating-summary">
                        <div className="average-rating">
                            <FaStar className="star-icon" />
                            <span>{book.average_rating || '0'}</span>
                        </div>
                        <span className="rating-count">
                            ({book.rating_count || '0'} đánh giá)
                        </span>
                    </div>
                    <div className="book-detail-info">
                        <h1>{book.title}</h1>
                        <div className="book-info-item">
                            <strong>Tác giả:</strong> {book.author}
                        </div>
                        <div className="book-info-item">
                            <strong>Thể loại:</strong> {book.category}
                        </div>
                        <div className="book-info-item">
                            <strong>Năm xuất bản:</strong> {book.publication_year}
                        </div>
                        <div className="book-description">
                            <strong>Mô tả:</strong>
                            <p>{book.description || 'Chưa có mô tả cho sách này.'}</p>
                        </div>
                        <button className="borrow-button" onClick={haldReadBook}>Đọc Sách</button>
                    </div>
                </div>
            </div>
            <div className="book-detail-reviews">
                <BookRating
                    bookId={bookID.id}
                    userId={userId}
                    currentRating={book.average_rating}
                />
            </div>
        </div>
    );
};

export default BookDetail;
