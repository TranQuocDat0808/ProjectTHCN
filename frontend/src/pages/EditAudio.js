import React, { useState, useEffect } from 'react';
import '../styles/UpdateBook.css';

const EditAudio = ({ audio, onSubmitSuccess }) => {
    const [editingAudio, setEditingAudio] = useState(audio || {});
    const [coverPreview, setCoverPreview] = useState(audio?.cover_image || null);

    useEffect(() => {
        if (audio) {
            setEditingAudio(audio);
            setCoverPreview(audio.cover_image);
        }
    }, [audio]);

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
                setEditingAudio({ ...editingAudio, cover_image: "../images/" + file.name });
                setCoverPreview(URL.createObjectURL(file));
            }
        } else {
            setEditingAudio({ ...editingAudio, [name]: value });
        }
    };

    const handleCategoryChange = (e) => {
        setEditingAudio({ ...editingAudio, category: e.target.value });
    };

    const handleUpdateAudio = async (e) => {
        e.preventDefault();

        const url = `http://localhost:8080/api/audiobooks/${editingAudio.id || editingAudio.audio_id}`;
        const payload = {
            title: editingAudio.title,
            description: editingAudio.description,
            audio_url: editingAudio.audio_url,
            author: editingAudio.author,
            cover_image: editingAudio.cover_image,
            category: editingAudio.category,
        };

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Cập nhật sách nói thành công!');
                setCoverPreview(null);
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
            } else {
                const errData = await response.json();
                console.error("Lỗi từ server:", errData);
                alert("Lỗi: Không thể cập nhật sách nói. Hãy kiểm tra lại dữ liệu.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật sách nói:", error);
        }
    };

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Chỉnh Sửa Sách Nói</h1>
            </div>

            <form onSubmit={handleUpdateAudio} className="edit-form">
                <div className="form-grid">
                    <div className="form-left">
                        <div className="input-group">
                            <label>Tên sách nói</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Nhập tên sách nói"
                                value={editingAudio?.title || ''}
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
                                value={editingAudio?.author || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Thể loại</label>
                            <select
                                name="category"
                                value={editingAudio?.category || 'Chọn Thể Loại'}
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
                                value={editingAudio?.description || ''}
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
                                value={editingAudio?.audio_url || ''}
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
                        <i className="fas fa-save"></i> Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAudio;