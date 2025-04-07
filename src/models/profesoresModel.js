const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Profesor = sequelize.define('Profesor', {
    ID_Profesores: {
        type: DataTypes.INTEGER, 
        primaryKey: true
    },
    Nombre_completo: {
        type: DataTypes.STRING,
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
    Fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Celular: {
        type: DataTypes.STRING,
        allowNull: false
    },
    EPS: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ARL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Correo_institucional: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Correo_Personal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Nombre_familiar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono_familiar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Parentesco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Foto:{
        type: DataTypes.STRING
    }
}, {
    tableName: 'Profesores',
    timestamps: false
});

module.exports = Profesor;
