const express = require('express');
const cors = require('cors');
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewsRoutes = require('./routes/reviews');
const Book = require('./models/book');
require('dotenv').config();

const app = express();
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "library_db",
  password: "Nvutanie161206@",
  port: 5432,
});

// Middleware để xử lý body JSON và URL-encoded
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS
app.use(cors());

// Routes
app.use('/api', bookRoutes, reviewsRoutes);
app.use('/api/auth', authRoutes);

// Health check route (kiểm tra API có hoạt động không)
app.get('/api/health', (req, res) => {
  res.json({ message: "Server is running!" });
});

// Cập nhật lại route lấy tất cả sách (dùng Sequelize)
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.findAll(); // Sử dụng Sequelize để lấy tất cả sách
    res.json(books);  // Trả về danh sách sách dưới dạng JSON
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sách", error });
  }
});

// API đọc nội dung sách theo ID
app.get("/read-book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Lấy đường dẫn file từ DB
    const result = await pool.query("SELECT file_path FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // 2. Ghép đường dẫn đầy đủ đến file
    const filePath = result.rows[0].file_path;
    const fullPath = path.join(__dirname, "uploads", filePath);

    // 3. Kiểm tra file có tồn tại không
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // 4. Đọc file và trích xuất nội dung
    const data = fs.readFileSync(fullPath);

    // Sử dụng mammoth để trích xuất nội dung từ file
    mammoth.extractRawText({ buffer: data })
      .then(result => res.json({ content: result.value }))
      .catch(err => res.status(500).json({ error: err.message }));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});