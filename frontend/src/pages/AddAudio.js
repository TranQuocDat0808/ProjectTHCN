import React, { useState } from 'react';
import '../styles/UpdateBook.css';

const AddAudio = ({ onSubmitSuccess }) => {
    const [newAudio, setNewAudio] = useState({});
    const [coverPreview, setCoverPreview] = useState(null);

    const categories = [
        "Chọn Thể Loại",
        "Kỹ Năng Sống",
        "Bài Học Kinh Doanh",
        "Văn Học Viêt Nam",
        "Phật Pháp",
        "Maketing Bán Hàng",
        "Danh Nhân Thế Giới",
    ];

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "cover_image") {
            const file = files[0];
            if (file) {
                setNewAudio({ ...newAudio, cover_image: "../images/" + file.name });
                setCoverPreview(URL.createObjectURL(file));
            }
        } else {
            setNewAudio({ ...newAudio, [name]: value });
        }
    };

    // Thêm hàm xử lý chọn thể loại
    const handleCategoryChange = (e) => {
        setNewAudio({ ...newAudio, category: e.target.value });
    };

    const handleAddAudio = async (e) => {
        e.preventDefault();

        const url = "http://localhost:8080/api/audiobooks";
        const payload = {
            title: newAudio.title,
            description: newAudio.description,
            audio_url: newAudio.audio_url,
            author: newAudio.author,
            cover_image: newAudio.cover_image,
            category: newAudio.category, 
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) { 
                alert('Thêm sách nói thành công!');
                setCoverPreview(null);
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
                setNewAudio({});
            } else {
                const errData = await response.json();
                console.error("Lỗi từ server:", errData);
                alert("Lỗi: Không thể thêm sách nói. Hãy kiểm tra lại dữ liệu.");
            }
        } catch (error) {
            console.error("Lỗi khi thêm sách nói:", error);
        }
    };

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Thêm Sách Nói Mới</h1>
            </div>

            <form onSubmit={handleAddAudio} className="edit-form">
                <div className="form-grid">
                    <div className="form-left">
                        <div className="input-group">
                            <label>Tên sách nói</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Nhập tên sách nói"
                                value={newAudio?.title || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Tác giả</label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Nhập tên tác giả"
                                value={newAudio?.author || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Thêm trường thể loại */}
                        <div className="input-group">
                            <label>Thể loại</label>
                            <select
                                name="category"
                                value={newAudio?.category || 'Chọn Thể Loại'}
                                onChange={handleCategoryChange}
                            >
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                placeholder="Nhập mô tả sách nói"
                                value={newAudio?.description || ''}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>

                        <div className="input-group">
                            <label>Link file âm thanh</label>
                            <input
                                type="text"
                                name="audio_url"
                                placeholder="Dán link file mp3 hoặc audio"
                                value={newAudio?.audio_url || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-right">
                        <div className="upload-section">
                            <div className="cover-preview">
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <p>Tải lên ảnh bìa sách</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="cover_image"
                                id="cover-upload"
                                onChange={handleInputChange}
                                className="file-input"
                                accept="image/*"
                            />
                            <label htmlFor="cover-upload" className="upload-btn">
                                Chọn ảnh bìa
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        <i className="fas fa-plus"></i> Thêm sách nói
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAudio;
