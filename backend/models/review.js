const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'books', // Tên bảng tham chiếu
            key: 'book_id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Tên bảng tham chiếu
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'reviews'
});

module.exports = Review;