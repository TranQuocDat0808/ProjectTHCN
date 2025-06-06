import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Books.css";

const Books = () => {

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 15;
    const [category, setCategory] = useState('all');
    const navigate = useNavigate();

    // Gọi API để tải danh sách sách khi component được render lần đầu
    useEffect(() => {
        fetchBooks();
    }, []);

    // Lọc danh sách sách mỗi khi thể loại hoặc danh sách sách thay đổi
    useEffect(() => {
        filterBooks();
    }, [category, books]);

    // Hàm gọi API để lấy danh sách sách
    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/books'); 
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

    // Hàm lọc sách theo thể loại
    const filterBooks = () => {
        if (category === 'all') {
            setFilteredBooks(books); 
        } else {
            setFilteredBooks(books.filter(book => book.category.toLowerCase() === category.toLowerCase())); // Lọc sách theo thể loại
        }
    };

    // Hàm điều hướng đến trang chi tiết sách
    const handleViewDetails = (book_Id) => {
        navigate(`/book/${book_Id}`); // Điều hướng đến URL chi tiết sách
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    // Hàm chuyển đến trang tiếp theo
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredBooks.length / booksPerPage)) {
            setCurrentPage(currentPage + 1); 
        }
    };

    // Hàm quay lại trang trước
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1); 
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="books-container">
            {/* Header của trang */}
            <div className="books-header">
                <h1>Thư Viện Sách</h1>
                {/* Bộ lọc thể loại */}
                <div className="category-filter">
                    <select
                        onChange={(e) => setCategory(e.target.value)} 
                        className="category-filter"
                    >
                        <option value="all">Tất cả thể loại</option>
                        <option value="Viễn Tưởng">Viễn Tưởng</option>
                        <option value="Khoa Học">Khoa Học</option>
                        <option value="Tâm Linh">Tâm Linh</option>
                        <option value="Phật Pháp">Phật Pháp</option>
                        <option value="Bố Mẹ">Bố Mẹ</option>
                        <option value="Giáo Dục">Giáo Dục</option>
                        <option value="Kỹ Năng Sống">Kỹ Năng Sống</option>
                        <option value="Phát Triển Bản Thân">Phát Triển Bản Thân</option>                  
                        <option value="Tiểu Thuyết">Tiểu Thuyết</option>
                        <option value="Tâm Lý Học">Tâm Lý Học</option>
                    </select>
                </div>
            </div>
            {/* Danh sách sách */}
            <div className="books-grid">
                {currentBooks.length > 0 ? (
                    currentBooks.map((book) => (
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
                    <p className="no-results">Không tìm thấy sách phù hợp!</p> 
                )}
            </div>
            {/* Phân trang */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                    Trang trước
                </button>
                <span className="pagination-info">
                     {currentPage} / {Math.ceil(filteredBooks.length / booksPerPage)} {/* Hiển thị số trang */}
                </span>
                <button
                    onClick={nextPage}
                    disabled={currentPage === Math.ceil(filteredBooks.length / booksPerPage)}
                    className="pagination-button"
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default Books;
