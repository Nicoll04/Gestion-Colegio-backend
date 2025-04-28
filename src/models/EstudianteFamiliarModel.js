const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FamiliarEstudiante = sequelize.define('FamiliarEstudiante', {
    ID_Familiar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Familiares', 
            key: 'ID_Familiar',
        },
    },
    ID_Estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estudiantes', 
            key: 'ID_estudiante',
        },
    },
}, {
    tableName: 'FamiliarEstudiante',
    timestamps: false, 
});

module.exports = FamiliarEstudiante;
