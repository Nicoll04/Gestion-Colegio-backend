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
        allowNull: true 
    },
    Nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Nro_Documento: {
        type: DataTypes.STRING,
        allowNull: true, 
        unique: true
    },
    Direccion_Residencia: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    Celular: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true, 
    }
}, {
    tableName: 'Familiares',
    timestamps: false
});

module.exports = Familiar;
