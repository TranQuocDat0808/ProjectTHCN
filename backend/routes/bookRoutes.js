const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");
const User = require("../models/user");
const Review = require("../models/review");
const EPub = require("epubjs");
const router = express.Router();
const db = require('../config/database');
const Audiobook = require('../models/audiobook');

// Cấu hình lưu file EPUB
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "D:/Project FPT/LibraryBook/frontend/public/bookcontent";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// API lấy nội dung sách EPUB
router.get("/books/:id/content", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book || !book.bookcontent) {
            return res.status(404).json({ message: "Không tìm thấy nội dung sách" });
        }
        const bookPath = path.join(__dirname, `../../frontend/public${book.bookcontent}`);

        if (!fs.existsSync(bookPath)) {
            return res.status(404).json({ message: "File sách không tồn tại" });
        }
        const epub = new EPub(bookPath);
        epub.parse()
            .then(() => {
                let content = "";
                epub.flow.forEach((chapter) => {
                    content += chapter.text + "\n\n";
                });
                res.json({ content });
            })
            .catch((err) => {
                console.error("Lỗi khi đọc sách EPUB:", err);
                res.status(500).json({ message: "Lỗi khi đọc nội dung sách" });
            });
    } catch (error) {
        console.error("Lỗi khi lấy nội dung sách:", error);
        res.status(500).json({ message: "Lỗi khi lấy nội dung sách", error: error.message });
    }
});

// API thêm sách mới có hỗ trợ upload EPUB
router.post("/books", upload.single("bookcontent"), async (req, res) => {
    try {
        const { title, author, category, description, publication_year, image_url } = req.body;
        const bookcontent = req.file ? `/bookcontent/${req.file.originalname}` : null; // Giữ nguyên tên file

        if (!title || !author || !category) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin sách" });
        }

        const book = await Book.create({ title, author, category, description, publication_year, image_url, bookcontent });
        res.status(201).json({ message: "Thêm sách thành công", book });
    } catch (error) {
        console.error("Lỗi khi tạo sách:", error);
        res.status(500).json({ message: "Lỗi khi tạo sách", error: error.message });
    }
});

// Sách Đọc.

// Lấy tất cả sách
router.get("/books", async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách sách", error: error.message });
    }
});

// API lấy tổng số sách
router.get('/books/count', async (req, res) => {
    try {
        const totalBooks = await Book.count(); // Sử dụng Sequelize để đếm số lượng sách
        res.json({ total: totalBooks });
    } catch (error) {
        console.error('Lỗi khi lấy tổng số sách:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy sách theo ID
router.get("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }
        res.json(book);
    } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
        res.status(500).json({ message: "Lỗi khi lấy sách", error: error.message });
    }
});

// Cập nhật sách
router.put("/books/:id", upload.single("bookcontent"), async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        const { title, author, category, description, publication_year, image_url } = req.body;
        let bookcontent = book.bookcontent;

        if (req.file) {
            // Xóa file cũ nếu có
            if (book.bookcontent) {
                const oldFilePath = path.join("D:/Project FPT/LibraryBook/frontend/public/bookcontent", path.basename(book.bookcontent));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Cập nhật đường dẫn file mới
            bookcontent = `/bookcontent/${req.file.originalname}`;
        }

        // Cập nhật thông tin sách
        await book.update({ title, author, category, description, publication_year, image_url, bookcontent });

        res.json({ message: "Cập nhật sách thành công", book });
    } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật sách", error: error.message });
    }
});

// Xóa sách
router.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        if (book.bookcontent) {
            const bookFilePath = path.join("D:/Project FPT/LibraryBook/frontend/public/bookcontent", path.basename(book.bookcontent));
            if (fs.existsSync(bookFilePath)) {
                fs.unlinkSync(bookFilePath);
            }
        }

        await book.destroy();
        res.json({ message: "Xóa sách thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        res.status(500).json({ message: "Lỗi khi xóa sách", error: error.message });
    }
});

// Sách nói
// Lấy tất cả sách nói
router.get('/audiobooks', async (req, res) => {
    try {
        const audiobooks = await Audiobook.findAll();
        res.json(audiobooks);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sách nói:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sách nói', error: error.message });
    }
});

// API lấy tổng số sách nói (audiobooks)
router.get('/audiobooks/count', async (req, res) => {
    try {
        const totalAudiobooks = await Audiobook.count();
        res.json({ total: totalAudiobooks });
    } catch (error) {
        console.error('Lỗi khi lấy tổng số sách nói:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy sách nói theo ID
router.get('/audiobooks/:id', async (req, res) => {
    try {
        const audiobook = await Audiobook.findByPk(req.params.id);
        if (!audiobook) {
            return res.status(404).json({ message: "Không tìm thấy sách nói" });
        }
        res.json(audiobook);
    } catch (error) {
        console.error("Lỗi khi lấy sách nói:", error);
        res.status(500).json({ message: "Lỗi khi lấy sách nói", error: error.message });
    }
});

// Thêm sách nói mới
router.post("/audiobooks", async (req, res) => {
    try {
        const { title, author, audio_url, cover_image, description, category } = req.body;
        const newBook = await Audiobook.create({ title, author, audio_url, cover_image, description, category });
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Xóa sách nói
router.delete('/audiobooks/:id', async (req, res) => {
    try {
        const audiobook = await Audiobook.findByPk(req.params.id);
        if (!audiobook) {
            return res.status(404).json({ message: "Không tìm thấy sách nói" });
        }

        await audiobook.destroy();
        res.json({ message: "Xóa sách nói thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa sách nói:", error);
        res.status(500).json({ message: "Lỗi khi xóa sách nói", error: error.message });
    }
});

// Cập nhật sách nói
router.put("/audiobooks/:id", async (req, res) => {
    try {
        const audiobook = await Audiobook.findByPk(req.params.id);
        if (!audiobook) {
            return res.status(404).json({ message: "Không tìm thấy sách nói" });
        }

        const { title, author, category, description, audio_url, cover_image } = req.body;

        await audiobook.update({ title, author, category, description, audio_url, cover_image });

        res.json({ message: "Cập nhật sách nói thành công", audiobook });
    } catch (error) {
        console.error("Lỗi khi cập nhật sách nói:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật sách nói", error: error.message });
    }
});


// Lấy tất cả user
router.get("/users", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách user", error: error.message });
    }
});

// API lấy tổng số tài khoản người dùng
router.get('/users/count', async (req, res) => {
    try {
        const totalUsers = await User.count(); // Sử dụng Sequelize để đếm số lượng người dùng
        res.json({ total: totalUsers });
    } catch (error) {
        console.error('Lỗi khi lấy tổng số tài khoản người dùng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Xóa user
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        await user.destroy();
        res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        res.status(500).json({ message: "Lỗi khi xóa người dùng", error: error.message });
    }
});



// Lấy tất cả review
router.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá", error: error.message });
    }
});

// API lấy tổng số review
router.get('/reviews/count', async (req, res) => {
    try {
        const totalReviews = await Review.count(); // Sử dụng Sequelize để đếm số lượng người dùng
        res.json({ total: totalReviews });
    } catch (error) {
        console.error('Lỗi khi lấy tổng số tài khoản người dùng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Xóa review
router.delete("/reviews/:id", async (req, res) => {
    try {
        const reviewId = req.params.id;

        // Kiểm tra nếu ID không hợp lệ
        if (!reviewId) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
        }

        // Tìm đánh giá theo ID
        const review = await Review.findByPk(reviewId);
        const bookId = review.book_id;
        if (!review) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá" });
        }

        // Xóa đánh giá
        await review.destroy();

        await updateBookRating(bookId);

        res.json({ message: "Xóa đánh giá thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        res.status(500).json({ message: "Lỗi khi xóa đánh giá", error: error.message });
    }
});

// Cập nhật rating trung bình
async function updateBookRating(bookId) {
    try {
        const avgResult = await db.query(`
            SELECT AVG(rating) as avg_rating, COUNT(*) as count
            FROM reviews 
            WHERE book_id = ${bookId}
        `);

        const { avg_rating, count } = avgResult[0][0];

        await db.query(`
            UPDATE books 
            SET average_rating = ${avg_rating || 0}, rating_count = ${count}
            WHERE book_id = ${bookId}
        `);
    } catch (error) {
        console.error('Lỗi khi cập nhật rating:', error);
    }
}

module.exports = router;
