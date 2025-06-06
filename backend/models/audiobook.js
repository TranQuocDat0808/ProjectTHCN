const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Audiobook = db.define('Audiobook', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    audio_url: {
        type: DataTypes.STRING(255)
    },
    author: {
        type: DataTypes.STRING(100) 
    },
    cover_image: {
        type: DataTypes.STRING(255)
    },
    category: {
        type: DataTypes.STRING(100)
    }
}, {
    tableName: 'audiobooks',
    timestamps: false
});

module.exports = Audiobook;