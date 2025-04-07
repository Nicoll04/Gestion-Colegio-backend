const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Estudiante = sequelize.define('Estudiante', {
    ID_estudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    ID_Curso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Tipo_documento: {
        type: DataTypes.ENUM('TI', 'CC', 'NUIP'),
        allowNull: false
    },
    Nro_Documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    RH: {
        type: DataTypes.STRING,
        allowNull: false
    },
    EPS: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Correo_institucional: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Estado: {
        type: DataTypes.ENUM('ACTIVO', 'RETIRADO'),
        allowNull: false
    },
    Direccion_Residencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Foto:{
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'Estudiantes',
    timestamps: false
});


module.exports = Estudiante;