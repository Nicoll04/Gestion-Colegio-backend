// models/familiarEstudianteModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FamiliarEstudiante = sequelize.define('FamiliarEstudiante', {
  ID_Familiar: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  ID_Estudiante: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }
}, {
  tableName: 'FamiliarEstudiante',
  timestamps: false,  
});

module.exports = FamiliarEstudiante;
