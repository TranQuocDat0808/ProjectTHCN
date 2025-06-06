import React, { useState, useEffect } from 'react';
import '../styles/UpdateBook.css';

const EditBook = ({ book, onSubmitSuccess }) => {
    const [editingBook, setEditingBook] = useState(book || {});
    const [coverPreview, setCoverPreview] = useState(null);

    useEffect(() => {
        if (book) {
            setEditingBook(book);
            if (book.image_url) {
                setCoverPreview(process.env.PUBLIC_URL + book.image_url);
            }
        }
    }, [book]);

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

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image_url" || name === "bookcontent") {
            const file = files[0];
            if (!file) return;

            if (name === "image_url") {
                setEditingBook({ ...editingBook, [name]: "../images/" + file.name });
                setCoverPreview(URL.createObjectURL(file));
            } else if (name === "bookcontent") {
                setEditingBook({ ...editingBook, [name]: file.name });
                console.log('File đã được chọn:', file.name);
            }
        } else {
            setEditingBook({ ...editingBook, [name]: value });
        }
    };

    const handleCategoryChange = (e) => {
        setEditingBook({ ...editingBook, category: e.target.value });
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();

        const url = `http://localhost:8080/api/books/${editingBook.book_id}`;
        const formData = new FormData();
        formData.append("title", editingBook.title);
        formData.append("author", editingBook.author);
        formData.append("category", editingBook.category);
        formData.append("publication_year", editingBook.publication_year);
        formData.append("description", editingBook.description);
        formData.append("image_url", editingBook.image_url);

        const bookContentFile = document.querySelector("input[name='bookcontent']")?.files?.[0];
        if (bookContentFile) {
            formData.append("bookcontent", bookContentFile);
        }

        try {
            const response = await fetch(url, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                alert('Cập nhật sách thành công!'); 
                setEditingBook({});
                setCoverPreview(null);
                if (onSubmitSuccess) {
                    onSubmitSuccess(); 
                }
            } else {
                alert('Có lỗi xảy ra khi cập nhật sách!'); 
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật sách:", error);
        }
    };

    return (
        <div className="admin-books">
            <div className="admin-header">
                <h1>Chỉnh Sửa Sách</h1>
            </div>

            <form onSubmit={handleUpdateBook} className="edit-form">
                <div className="form-grid">
                    <div className="form-left">
                        <div className="input-group">
                            <label>Tên sách</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Nhập tên sách"
                                value={editingBook?.title || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Tác giả</label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Nhập tên tác giả"
                                value={editingBook?.author || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Thể loại</label>
                            <select
                                name="category"
                                value={editingBook?.category || 'Chọn Thể Loại'}
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
                                value={editingBook?.publication_year || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                placeholder="Nhập mô tả sách"
                                value={editingBook?.description || ''}
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
                                Chọn bìa sách!
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

export default EditBook;