const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Curso = sequelize.define('Curso', {
    ID_Curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre_curso: {
        type: DataTypes.STRING(50), 
        allowNull: false
    },
    Grado: {
        type: DataTypes.ENUM('Preescolar', 'Primaria', 'Bachillerato'),
        allowNull: false
    },
     ID_ProfesorDirector: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Profesor',
            key: 'ID_Profesores'
        }
    }
}, {
    tableName: 'Curso',
    timestamps: false
});



module.exports = Curso;
