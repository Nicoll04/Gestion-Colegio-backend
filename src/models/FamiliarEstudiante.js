module.exports = (sequelize, DataTypes) => {
    const FamiliarEstudiante = sequelize.define('FamiliarEstudiante', {
      ID_FamiliarEstudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ID_Estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID_Familiar: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'FamiliarEstudiante',
      timestamps: false
    });
  
    return FamiliarEstudiante;
  };
  