const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Review = require('../models/review');

// Lấy tất cả đánh giá của một cuốn sách
router.get('/books/:bookId/reviews', async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const [rows] = await db.query(`
            SELECT r.*, u.full_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.book_id = ${bookId}
            ORDER BY r.created_at DESC
        `);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá' });
    }
});

// Thêm đánh giá mới
router.post('/reviews', async (req, res) => {
    try {
        const { userId,bookId, rating, comment,title,name } = req.body;

        console.log(req.body);
        

        if (!userId || !bookId || !rating || !comment) {
            return res.status(400).json({ message: "Thiếu thông tin đánh giá." });
        }

        const newRating = await Review.create({
            user_id: userId,
            book_id: bookId,
            name: name,
            title: title,
            rating: rating,
            comment: comment
        });
		// Sau khi thêm thì cập nhật điểm trung bình
        await updateBookRating(bookId);

        res.status(201).json({ message: "Gửi đánh giá thành công!",rating: newRating });
    } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        res.status(500).json({ message: "Lỗi server", error });
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