import React, { useState } from 'react';
import '../styles/UpdateBook.css';

const AddBook = ({ onSubmitSuccess }) => {
    const [newBook, setNewBook] = useState({});
    const [coverPreview, setCoverPreview] = useState(null);

    const categories = [
        "Chọn Thể Loại",
        "Viễn Tưởng",
        "Khoa Học",
        "Tâm Linh",
        "Phật Pháp",
        "Bố Mẹ",
        "Giáo Dục",
        "Kỹ Năng Sống",
        "Phát Triển Bản Thân",
        "Tiểu Thuyết",
        "Tâm Lý Học",
    ];

    // Cập nhật hàm handleInputChange
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image_url" || name === "bookcontent") {
            const file = files[0];
            if (!file) return;

            if (name === "image_url") {
                setNewBook({ ...newBook, [name]: "../images/" + file.name });
                setCoverPreview(URL.createObjectURL(file));
            } else if (name === "bookcontent") {
                setNewBook({ ...newBook, [name]: file.name });
                console.log('File đã được chọn:', file.name);
            }
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    const handleCategoryChange = (e) => {
        setNewBook({ ...newBook, category: e.target.value });
    };

    const handleAddBook = async (e) => {
        e.preventDefault();

        const url = "http://localhost:8080/api/books";
        const formData = new FormData();
        formData.append("title", newBook.title);
        formData.append("author", newBook.author);
        formData.append("category", newBook.category);
        formData.append("publication_year", newBook.publication_year);
        formData.append("description", newBook.description);
        formData.append("image_url", newBook.image_url);

        const bookContentFile = document.querySelector("input[name='bookcontent']")?.files?.[0];
        if (bookContentFile) {
            formData.append("bookcontent", bookContentFile);
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (response.ok) { 
                alert('Thêm sách thành công!'); 
                setCoverPreview(null);
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
                setNewBook({});
               
            }
        } catch (error) {
            console.error("Lỗi khi thêm sách:", error);
        }
    };

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Thêm Sách Mới</h1>
            </div>

            <form onSubmit={handleAddBook} className="edit-form">
                <div className="form-grid">
                    <div className="form-left">
                        <div className="input-group">
                            <label>Tên sách</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Nhập tên sách"
                                value={newBook?.title || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tác giả</label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Nhập tên tác giả"
                                value={newBook?.author || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Thể loại</label>
                            <select
                                name="category"
                                value={newBook?.category || 'Chọn Thể Loại'}
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
                            <label>Năm xuất bản</label>
                            <input
                                type="text"
                                name="publication_year"
                                placeholder="Nhập năm xuất bản"
                                value={newBook?.publication_year || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                placeholder="Nhập mô tả sách"
                                value={newBook?.description || ''}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>

                        <div className="input-group">
                            <label>Nội dung sách</label>
                            <input 
                                type="file" 
                                name="bookcontent" 
                                onChange={handleInputChange}
                                accept=".epub, .pdf, .mobi, .azw3, .txt"
                                className="file-input-epub"
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
                                name="image_url"
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
                        <i className="fas fa-plus"></i> Thêm sách
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBook;