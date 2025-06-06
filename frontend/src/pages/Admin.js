import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {
    FaBook, FaUsers, FaComments, FaUniversity, FaChartLine, FaHome,
    FaSignOutAlt, FaHeadphonesAlt, FaEdit, FaHistory
} from 'react-icons/fa';
import AddBook from './AddBook';
import ManageBooks from './ManageBooks';
import Books from './Books';
import UserManagement from './UserManagement';
import ReviewManagement from './ReviewManagement';
import AudioManagement from './AudioManagement';
import EditBook from './EditBook';
import EditAudio from './EditAudio';
import AddAudio from './AddAudio';
import '../styles/Admin.css';

const Admin = () => {
    const [showAddBook, setShowAddBook] = useState(false);
    const [showManageBooks, setShowManageBooks] = useState(false);
    const [activeMenu, setActiveMenu] = useState('overview');
    const [showEditBook, setShowEditBook] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalAudiobooks, setTotalAudiobooks] = useState(0);
    const [showBooks, setShowBooks] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showAudios, setShowAudios] = useState(false);
    const [showEditAudio, setShowEditAudio] = useState(false);
    const [editingAudio, setEditingAudio] = useState(null);
    const [showAddAudio, setShowAddAudio] = useState(false);
    const [showAddAudioInAudio, setShowAddAudioInAudio] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, booksRes, reviewsRes, audiosRes] = await Promise.all([
                    fetch('http://localhost:8080/api/users/count'),
                    fetch('http://localhost:8080/api/books/count'),
                    fetch('http://localhost:8080/api/reviews/count'),
                    fetch('http://localhost:8080/api/audiobooks/count')
                ]);

                const [usersData, booksData, reviewsData, audiosData] = await Promise.all([
                    usersRes.json(),
                    booksRes.json(),
                    reviewsRes.json(),
                    audiosRes.json()
                ]);

                setTotalUsers(usersData.total);
                setTotalBooks(booksData.total);
                setTotalReviews(reviewsData.total);
                setTotalAudiobooks(audiosData.total);
            } catch (error) {
                setTotalUsers(0);
                setTotalBooks(0);
                setTotalReviews(0);
                setTotalAudiobooks(0);
            }
        };

        fetchStats();
    }, []);

    const handleAddBookSuccess = () => {
        setShowAddBook(true);
        setShowManageBooks(true);
        setEditingBook(null);
    };

    const handleBookManagement = () => {
        setActiveMenu('books');
        setShowBooks(true);
        setShowAudios(false);
        setShowUsers(false);
        setShowReviews(false);
        setShowAddBook(false);
        setShowManageBooks(false);
        setEditingBook(null);
    };

    const handleUserManagement = () => {
        setActiveMenu('users');
        setShowUsers(true);
        setShowBooks(false);
        setShowAudios(false);
        setShowAddBook(false);
        setShowManageBooks(false);
        setShowReviews(false);
        setEditingBook(null);
    };

    const handleOverview = () => {
        setActiveMenu('overview');
        setShowBooks(false);
        setShowUsers(false);
        setShowReviews(false);
        setShowAudios(false);
        setShowAddBook(false);
        setShowManageBooks(false);
        setEditingBook(null);
    };

    const handleAudioManagement = () => {
        setActiveMenu('audiobooks');
        setShowAudios(true);
        setShowBooks(false);
        setShowUsers(false);
        setShowReviews(false);
        setShowAddBook(false);
        setShowManageBooks(false);
        setEditingBook(null);
        setShowEditAudio(false);        
        setShowAddAudio(false);         
        setShowAddAudioInAudio(false);  
        setEditingAudio(null);          
    };

    const handleReviewManagement = () => {
        setActiveMenu('reviews');
        setShowReviews(true);
        setShowUsers(false);
        setShowBooks(false);
        setShowAudios(false);
        setShowAddBook(false);
        setShowManageBooks(false);
        setEditingBook(null);
    };

    const handleManageBook = () => {
        setActiveMenu('manageBooks');
        setShowManageBooks(true);
        setShowReviews(false);
        setShowUsers(false);
        setShowBooks(false);
        setShowAudios(false);
        setShowAddBook(false);
        setEditingBook(null);
    };

    const handleEditBook = () => {
        setShowEditBook(!showEditBook);
        setShowReviews(false);
    };

    const handleEditSuccess = () => {
        setShowEditBook(false);
        setShowManageBooks(true);
    };

    const handleEditFromManage = (book) => {
        setEditingBook(book);
        setShowEditBook(true);
        setShowManageBooks(false);
        setShowAddBook(false);
        setShowBooks(false);
        setShowUsers(false);
        setShowReviews(false);
        setShowAudios(false);
    };

    const handleEditAudio = (audio) => {
        setEditingAudio(audio);
        setShowEditAudio(true);
        setShowAddAudioInAudio(false);
    };

    const handleEditAudioSuccess = () => {
        setShowEditAudio(false);
        setEditingAudio(null);
        setShowAudios(true);
    };

    const handleAddAudioSuccess = () => {
        setShowAddAudio(false);
        setShowAudios(true); 
    };

    const handleShowAddAudioInAudio = () => {
        setShowAddAudioInAudio(true);
    };

    const handleAddAudioSuccessInAudio = () => {
        setShowAddAudioInAudio(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="admin-profile">
                    <img src="/images/admin.jpg" alt="Admin" className="admin-avatar" />
                    <h3>ADMIN</h3>
                    <p>Quản trị viên</p>
                </div>

                <nav className="admin-nav">
                    <div
                        className={`nav-item ${activeMenu === 'overview' ? 'active' : ''}`}
                        onClick={handleOverview}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaChartLine /> Tổng quan
                    </div>
                    <div
                        className={`nav-item ${activeMenu === 'books' ? 'active' : ''}`}
                        onClick={handleBookManagement}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaUniversity /> Thư Viện Sách
                    </div>
                    <div
                        className={`nav-item ${activeMenu === 'manageBooks' ? 'active' : ''}`}
                        onClick={handleManageBook}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaBook /> Quản lý sách
                    </div>
                    <div
                        className={`nav-item ${activeMenu === 'audiobooks' ? 'active' : ''}`}
                        onClick={handleAudioManagement}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaHeadphonesAlt /> Quản lý Audio
                    </div>
                    <div
                        className={`nav-item ${activeMenu === 'users' ? 'active' : ''}`}
                        onClick={handleUserManagement}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaUsers /> Quản lý User
                    </div>
                    <div
                        className={`nav-item ${activeMenu === 'reviews' ? 'active' : ''}`}
                        onClick={handleReviewManagement}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaComments /> Đánh giá
                    </div>

                    <div className="admin-footer">
                        <Link to="/" className="nav-item">
                            <FaHome /> Trang chủ
                        </Link>
                        <button className="nav-item logout-btn" onClick={handleLogout}>
                            <FaSignOutAlt /> Đăng xuất
                        </button>
                    </div>
                </nav>
            </div>

            <div className="admin-main">
                {/* Tổng quan */}
                {!showBooks && !showUsers && !showReviews && !showManageBooks && !showAudios ? (
                    <>
                        <div className="admin-header">
                            <h1>Tổng quan hệ thống</h1>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon books">
                                    <FaBook />
                                </div>
                                <div className="stat-details">
                                    <h3>Tổng số sách</h3>
                                    <p>{totalBooks}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon audiobooks">
                                    <FaHeadphonesAlt />
                                </div>
                                <div className="stat-details">
                                    <h3>Tổng số Audio</h3>
                                    <p>{totalAudiobooks}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon users">
                                    <FaUsers />
                                </div>
                                <div className="stat-details">
                                    <h3>Người dùng</h3>
                                    <p>{totalUsers}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon reviews">
                                    <FaComments />
                                </div>
                                <div className="stat-details">
                                    <h3>Đánh giá</h3>
                                    <p>{totalReviews}</p>
                                </div>
                            </div>
                        </div>

                        <div className="admin-content">
                            <div className="quick-actions">
                                <h2>Thao tác nhanh</h2>
                                <div className="action-buttons">
                                    <button
                                        className="action-btn"
                                        onClick={() => {
                                            setShowAddBook(!showAddBook);
                                            setShowEditBook(false);
                                            setShowManageBooks(false);
                                            setEditingBook(null);
                                        }}
                                    >
                                        <FaEdit /> {showAddBook ? 'Đóng form' : 'Thêm sách điện tử'}
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={handleEditBook}
                                    >
                                        <FaHistory /> {showEditBook ? 'Đóng form' : 'Cập nhật sách điện tử'}
                                    </button>
                                </div>
                            </div>
                            {showAddBook && <AddBook book={editingBook} onSubmitSuccess={handleAddBookSuccess} />}
                            {showEditBook && <EditBook book={editingBook} onSubmitSuccess={handleEditSuccess} />}

                        </div>
                    </>
                ) : showBooks ? (
                    <div className="admin-content">
                        <Books />
                    </div>
                ) : showUsers ? (
                    <div className="admin-content">
                        <UserManagement />
                    </div>
                ) : showReviews ? (
                    <div className="admin-content">
                        <ReviewManagement />
                    </div>
                ) : showManageBooks ? (
                    <div className="admin-content">
                        <ManageBooks onEdit={handleEditFromManage} />
                    </div>
                ) : showAddAudio ? (
                    <div className="admin-content">
                        <AddAudio onSubmitSuccess={handleAddAudioSuccess} />
                    </div>
                ) : showEditAudio ? (
                    <div className="admin-content">
                        <EditAudio audio={editingAudio} onSubmitSuccess={handleEditAudioSuccess} />
                    </div>
                ) : showAudios ? (
                    <div className="admin-content">
                        {showAddAudioInAudio ? (
                            <AddAudio onSubmitSuccess={handleAddAudioSuccessInAudio} />
                        ) : showEditAudio ? (
                            <EditAudio audio={editingAudio} onSubmitSuccess={handleEditAudioSuccess} />
                        ) : (
                            <AudioManagement onEdit={handleEditAudio} onAdd={handleShowAddAudioInAudio} />
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Admin;