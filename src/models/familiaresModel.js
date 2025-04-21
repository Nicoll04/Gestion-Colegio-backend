const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Familiar = sequelize.define('Familiar', {
    ID_Familiar: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    ID_Estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Representante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Parentesco: {
        type: DataTypes.STRING,
        allowNull: false
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
    Direccion_Residencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Celular: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Familiares',
    timestamps: false
});

module.exports = Familiar;
