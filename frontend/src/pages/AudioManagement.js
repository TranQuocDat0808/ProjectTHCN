import React, { useState, useEffect } from 'react';
import '../styles/AdminBooks.css';

const AudioManagement = ({ onEdit, onAdd }) => {
    const [audios, setAudios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [audiosPerPage] = useState(5);

    useEffect(() => {
        fetchAudios();
    }, []);

    // Lấy danh sách audio từ API
    const fetchAudios = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/audiobooks');
            const data = await response.json();
            setAudios(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách audio:', error);
        }
    };

    const filteredAudios = audios.filter(audio =>
        (audio.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (audio.author?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (audio.category?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    // Tính toán phân trang
    const indexOfLastAudio = currentPage * audiosPerPage;
    const indexOfFirstAudio = indexOfLastAudio - audiosPerPage;
    const currentAudios = filteredAudios.slice(indexOfFirstAudio, indexOfLastAudio);
    const totalPages = Math.ceil(filteredAudios.length / audiosPerPage);


    const handleDelete = async (audioId) => {
        if (window.confirm('Bạn có chắc muốn xóa audio này?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/audiobooks/${audioId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Xóa audio thành công!');
                    fetchAudios();
                } else {
                    alert('Có lỗi xảy ra khi xóa audio!');
                }
            } catch (error) {
                console.error('Lỗi khi xóa audio:', error);
                alert('Có lỗi xảy ra khi xóa audio!');
            }
        }
    };

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Quản Lý Sách Nói (Audio)</h1>
                <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, tác giả, thể loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button
                        className="action-btn"
                        onClick={onAdd}
                        style={{ marginLeft: 8 }}
                    >
                        <i className="fas fa-plus"></i> Thêm sách nói
                    </button>
                </div>
            </div>

            <table className="books-table">
                <thead>
                    <tr>
                        <th>Tên audio</th>
                        <th>Tác giả</th>
                        <th>Thể loại</th>
                        <th>Hình ảnh</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAudios.map((audio) => (
                        <tr key={audio.id || audio.audio_id}>
                            <td>{audio.title}</td>
                            <td>{audio.author}</td>
                            <td>{audio.category}</td>
                            <td>
                                <img
                                    src={audio.cover_image}
                                    alt={audio.title}
                                    style={{ width: '85px', height: 'auto' }}
                                />
                            </td>
                            <td>
                                <button onClick={() => onEdit(audio)} className="edit-btn">
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(audio.id || audio.audio_id)} className="delete-btn">
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

export default AudioManagement;