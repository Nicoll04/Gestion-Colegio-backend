const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Usuario = sequelize.define('Usuario', {
    ID_Usuario: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4() 
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Rol: {
        type: DataTypes.ENUM('admin', 'secretaria', 'coordinacion','profesor','orientacion'), 
        allowNull: true  
    }
}, {
    tableName: 'Usuarios',
    timestamps: false
});

module.exports = Usuario;
