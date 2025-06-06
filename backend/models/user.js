const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'user'
    },
    last_login: {
        type: DataTypes.DATE
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false,
    createdAt: 'created_at',
    updatedAt:false,
    tableName: 'users'
}); 

module.exports = User;