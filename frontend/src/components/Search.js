import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allBooks, setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 15;
    const navigate = useNavigate();

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/books');
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setAllBooks(data);
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setAllBooks([]);
            setSearchResults([]);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults(allBooks);
            setCurrentPage(1);
        }
    }, [searchTerm, allBooks]);

    const handleViewDetails = (book_Id) => {
        navigate(`/book/${book_Id}`);
    };

    // Tính toán các sách hiển thị trên trang hiện tại
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = searchResults.slice(indexOfFirstBook, indexOfLastBook);

    // Chuyển sang trang tiếp theo
    const nextPage = () => {
        if (currentPage < Math.ceil(searchResults.length / booksPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Quay lại trang trước
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Thêm hàm xử lý tìm kiếm gợi ý
    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = allBooks.filter(
            (book) =>
                book.title.toLowerCase().includes(value.toLowerCase()) ||
                book.author.toLowerCase().includes(value.toLowerCase()) ||
                book.category.toLowerCase().includes(value.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 5)); // Giới hạn 5 gợi ý
        setShowSuggestions(true);
    };
    
    // Cập nhật hàm handleSuggestionClick
    const handleSuggestionClick = (book) => {
        setSearchTerm(book.title);
        setShowSuggestions(false);
        navigate(`/book/${book.book_id}`); // Chuyển hướng trực tiếp đến trang chi tiết
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === "") {
            setSearchResults(allBooks);
            setCurrentPage(1);
            return;
        }
        const filtered = allBooks.filter(
            (book) =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
        setCurrentPage(1);
        setShowSuggestions(false);
    };

    // Cập nhật phần render suggestions trong return
    return (
        <div className="search-container">
            <form className="search-form" onSubmit={handleSearchSubmit}>
                <div className="search-input-container">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchInput}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Tìm kiếm theo tên sách, tác giả hoặc thể loại..."
                            className="search-input"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map((book) => (
                                    <div
                                        key={book.book_id}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(book)}
                                    >
                                        <img 
                                            src={book.image_url} 
                                            alt={book.title} 
                                            className="suggestion-image"
                                        />
                                        <div className="suggestion-info">
                                            <div className="suggestion-title">{book.title}</div>
                                            <div className="suggestion-author">Tác giả: {book.author}</div>
                                            <div className="suggestion-category">Thể loại: {book.category}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="search-button">
                        Tìm kiếm
                    </button>
                </div>
            </form>

            {searchResults.length > 0 ? (
                <div className="search-results">
                    <h3>Thư viện Sách:</h3>
                    <div className="results-grid">
                        {currentBooks.map((book) => (
                            <div key={book.book_id} className="book-card">
                                <div className="book-image" onClick={() => handleViewDetails(book.book_id)}>
                                    <img src={book.image_url} alt={book.title} />
                                </div>
                                <h4>{book.title}</h4>
                            </div>
                        ))}
                    </div>
                    {/* Phân trang */}
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                            Trang trước
                        </button>
                        <span className="pagination-info">
                            Trang {currentPage} / {Math.ceil(searchResults.length / booksPerPage)}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === Math.ceil(searchResults.length / booksPerPage)}
                            className="pagination-button"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            ) : (
                <p className="no-results">Không tìm thấy sách phù hợp!</p>
            )}
        </div>
    );
};

export default Search;