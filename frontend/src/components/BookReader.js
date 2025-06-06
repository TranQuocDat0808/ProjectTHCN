import React, { useState, useEffect } from 'react';
import '../styles/BookReader.css';
import { FaArrowLeft, FaArrowRight, FaFont, FaMoon } from 'react-icons/fa';
import ePub from 'epubjs';
import { useParams, useNavigate } from 'react-router-dom';

const BookReader = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [fontSize, setFontSize] = useState(18);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [book, setBook] = useState(null);
    const [rendition, setRendition] = useState(null);
    const [bookTitle, setBookTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleExit = () => {
        navigate(-1);
    };

    // Fetch dữ liệu sách từ API khi `bookId` thay đổi
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch book data');
                }
                const data = await response.json();

                if (data && data.bookcontent) {
                    const bookInstance = ePub(data.bookcontent);
                    setBook(bookInstance);
                    setBookTitle(data.title || '');
                } else {
                    console.error("Không tìm thấy 'bookcontent' trong dữ liệu:", data);
                }
            } catch (error) {
                console.error("Lỗi khi tải sách:", error);
            }
        };

        fetchBook();
    }, [bookId]);

    // Khi sách đã load xong, render sách vào `#viewer`
    useEffect(() => {
        if (book) {
            const viewer = document.getElementById('viewer');

            const renditionInstance = book.renderTo(viewer, {
                width: '100%',
                height: '600px',
                allowScriptedContent: true,
            });

            renditionInstance.display();
            renditionInstance.on('relocated', (location) => {
                const pageNumber = location.start.location || 1;
                setCurrentPage(pageNumber);
            });

            setRendition(renditionInstance);

            return () => {
                renditionInstance.destroy();
            };
        }
    }, [book]);

    // Tăng/giảm cỡ chữ
    const handleFontSizeChange = (delta) => {
        setFontSize((prev) => {
            const newSize = Math.min(Math.max(prev + delta, 14), 24);
            if (rendition) {
                rendition.themes.fontSize(`${newSize}px`);
            }
            return newSize;
        });
    };

    // Bật/tắt chế độ tối
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    // Áp dụng chế độ tối hoặc sáng
    useEffect(() => {
        if (rendition) {
            rendition.themes.default({
                body: {
                    color: isDarkMode ? 'white' : '#000',
                    background: isDarkMode ? '#000' : '#fff',
                },
            });
        }
    }, [isDarkMode, rendition]);

    // Điều hướng trang
    const handlePageChange = async (direction) => {
        if (!rendition) {
            console.error("Rendition chưa được khởi tạo.");
            return;
        }

        try {
            if (direction === 'next') {
                await rendition.next();
            } else {
                await rendition.prev();
            }
        } catch (error) {
            console.error("Lỗi khi điều hướng trang:", error);
        }
    };

    return (
        <div className="reader-container">
            <div className="reader-header">
                <button className="btn-exit" onClick={handleExit}>
                    <FaArrowLeft /> Quay lại
                </button>
                <h2 className="book-title">{bookTitle}</h2>
            </div>

            <div id="viewer" className={`book-content ${isDarkMode ? 'dark-mode' : ''}`}></div>

            <div className="reading-settings">
                <button className="setting-btn" onClick={() => handleFontSizeChange(2)}>
                    <FaFont /> A+
                </button>
                <button className="setting-btn" onClick={() => handleFontSizeChange(-2)}>
                    <FaFont /> A-
                </button>
                <button className="setting-btn" onClick={toggleDarkMode}>
                    <FaMoon /> {isDarkMode ? 'Sáng' : 'Tối'}
                </button>
            </div>

            <div className="page-navigation">
                <button className="nav-btn" onClick={() => handlePageChange('prev')}>
                    <FaArrowLeft /> Trang trước
                </button>
                <span className="page-info">Trang {currentPage}</span>
                <button className="nav-btn" onClick={() => handlePageChange('next')}>
                    Trang sau <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default BookReader;