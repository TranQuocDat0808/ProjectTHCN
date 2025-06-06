const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "library_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "Nvutanie161206@",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",  
  }
);

// Kiểm tra kết nối
sequelize.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err));

module.exports = sequelize;
