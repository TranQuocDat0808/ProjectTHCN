import React, { useState, useEffect } from 'react';
import '../styles/AdminBooks.css';

const ManageBooks = ({ onEdit }) => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/books');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sách:', error);
        }
    };

    // Lọc sách theo search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tính toán phân trang
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handleEdit = (book) => {
        if (onEdit) {
            onEdit(book);
        }
    };

    const handleDelete = async (bookId) => {
        if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Xóa sách thành công!');
                    fetchBooks();
                } else {
                    alert('Có lỗi xảy ra khi xóa sách!');
                }
            } catch (error) {
                console.error('Lỗi khi xóa sách:', error);
                alert('Có lỗi xảy ra khi xóa sách!');
            }
        }
    };

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Quản Lý Thông Tin Sách</h1>
                <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, tác giả, thể loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <table className="books-table">
                <thead>
                    <tr>
                        <th>Tên sách</th>
                        <th>Tác giả</th>
                        <th>Thể loại</th>
                        <th>Xuất Bản</th>
                        <th>Hình ảnh</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBooks.map((book) => (
                        <tr key={book.book_id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>{book.publication_year}</td>
                            <td>
                                <img
                                    src={process.env.PUBLIC_URL + book.image_url}
                                    alt={book.title}
                                    style={{ width: '85px', height: 'auto' }}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleEdit(book)} className="edit-btn">
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(book.book_id)} className="delete-btn">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

export default ManageBooks;