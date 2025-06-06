const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import Sequelize instance

const Book = sequelize.define("Book", {
    book_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Uncategorized"
    },
    description: {
        type: DataTypes.TEXT,
    },
    publication_year: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: true,
            min: 1000,
            max: new Date().getFullYear()
        }
    },
    image_url: {
        type: DataTypes.STRING(255),
    },  
    bookcontent: {
        type:DataTypes.STRING,
    },
    average_rating:{
        type: DataTypes.FLOAT,
    },
    rating_count:{
        type: DataTypes.INTEGER,
    }
}, {
    timestamps: true, 
    tableName: "books",
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
    
});

module.exports = Book;
