import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/audiobooks.css';


const AudioBooks = () => {
    const [audioBooks, setAudioBooks] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); 
    const audiosPerPage = 15;
    const audioRef = useRef(null);
    const { id } = useParams();

const categories = [
    "Tất cả",
    "Kỹ Năng Sống",
    "Bài Học Kinh Doanh",
    "Phật Pháp",
    "Maketing Bán Hàng",
    "Danh Nhân Thế Giới",
    "Khoa Học"
];

    // Lấy danh sách sách nói từ API khi component mount hoặc id thay đổi
    useEffect(() => {
        fetch('http://localhost:8080/api/audiobooks')
            .then(res => res.json())
            .then(data => {
                setAudioBooks(data);
                if (id) {
                    const audioBook = data.find(audio => audio.id === parseInt(id));
                    setCurrentAudio(audioBook);
                }
            })
            .catch(() => setAudioBooks([]));
    }, [id]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // Cập nhật thời gian hiện tại khi audio phát
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    // Khi audio load xong metadata thì lấy tổng thời lượng
    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    // Định dạng thời gian hiển thị mm:ss
    const formatTime = (time) => {
        if (!isFinite(time) || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const filteredAudioBooks = audioBooks.filter(audio =>
        (selectedCategory === "Tất cả" || audio.category === selectedCategory) &&
        (
            audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (audio.author && audio.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (audio.category && audio.category.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    const indexOfLastAudio = currentPage * audiosPerPage;
    const indexOfFirstAudio = indexOfLastAudio - audiosPerPage;
    const currentAudios = filteredAudioBooks.slice(indexOfFirstAudio, indexOfLastAudio);
    const totalPages = Math.ceil(filteredAudioBooks.length / audiosPerPage);

    // Chuyển trang tiếp theo
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Quay lại trang trước
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="audiobooks-page">
            {/* Header trang sách nói */}
            <div className="audiobooks-header">
                <div className="header-content">
                    <div>
                        <h1>Thư Viện Sách Nói (Audio)</h1>
                        <p>Trải nghiệm tri thức qua âm thanh với bộ sưu tập sách nói chất lượng</p>
                        <div className="header-decoration">
                            <span></span>
                            <i className="fas fa-headphones-alt"></i>
                            <span></span>
                        </div>
                    </div>
                    <div className="audio-search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sách, thể loại hoặc tác giả..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="audio-search-input"
                        />
                    </div>
                </div>
            </div>

            {/* Thanh filter thể loại */}
            <div className="category-filter">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`filter-btn${selectedCategory === cat ? ' active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid danh sách sách nói */}
            <div className="audiobooks-grid">
                {currentAudios.length === 0 && <p>Chưa có sách nói nào.</p>}
                {currentAudios.map(audio => (
                    <Link to={`/audiobook/${audio.id || audio.audio_id}`} className="audiobook-card" key={audio.id || audio.audio_id}>
                        <div className="audiobook-cover">
                            <img src={audio.cover_image} alt={audio.title} />
                        </div>
                        <div className="audiobook-details">
                            <div className="book-info">
                                <h3>{audio.title}</h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Phân trang */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                    Trang trước
                </button>
                <span className="pagination-info">
                    {currentPage} / {totalPages === 0 ? 1 : totalPages}
                </span>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="pagination-button"
                >
                    Trang sau
                </button>
            </div>

            {/* Player phát audio nếu có */}
            {currentAudio && (
                <div className="audio-player">
                    <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        src={currentAudio.audio_url}
                    />
                    <div className="single-time-info">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioBooks;
