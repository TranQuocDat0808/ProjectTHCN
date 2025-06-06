import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import "../styles/Books.css";

const CategoryPage = () => {
    const { categoryName } = useParams(); 
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [categoryName]); 

    useEffect(() => {
        filterBooks();
    }, [books]); 

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/books`);
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu sách');
            }
            const data = await response.json();
            setBooks(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Hàm lọc sách theo categoryName
    const filterBooks = () => {
        const filtered = books.filter((book) => 
            book.category.toLowerCase() === categoryName.toLowerCase()
        );
        setFilteredBooks(filtered);
    };

    // Hàm điều hướng đến trang chi tiết sách
    const handleViewDetails = (book_Id) => {
        navigate(`/book/${book_Id}`);
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="books-container">
            <div className="books-header">
                <h1>Thể loại: {decodeURIComponent(categoryName)}</h1>
            </div>

            <div className="books-grid">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div key={book.book_id} className="book-card">
                            <div className="book-image" onClick={() => handleViewDetails(book.book_id)}>
                                <img src={book.image_url} alt={book.title} />
                            </div>
                            <div className="book-info">
                                <h3>{book.title}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-books">
                        <p>Không tìm thấy sách nào.</p>
                        <Link to="/books" className="back-to-books">
                            Quay lại trang sách
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
