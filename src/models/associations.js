const Curso = require('./cursosModel');
const Estudiante = require('./estudiantesModel');
const Familiar = require('./familiaresModel');
const FamiliarEstudiante = require('./FamiliarEstudiante');

// Relaciones entre Curso y Estudiante
Curso.hasMany(Estudiante, { foreignKey: 'ID_Curso', as: 'estudiantes' });
Estudiante.belongsTo(Curso, { foreignKey: 'ID_Curso', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Relaciones entre Estudiante y Familiar
Estudiante.belongsToMany(Familiar, {
    through: FamiliarEstudiante,
    foreignKey: 'ID_Estudiante',
    otherKey: 'ID_Familiar',
    as: 'familiares'
  });
  
  Familiar.belongsToMany(Estudiante, {
    through: FamiliarEstudiante,
    foreignKey: 'ID_Familiar',
    otherKey: 'ID_Estudiante',
    as: 'estudiantes'
  });

  module.exports = {
    Curso,
    Estudiante,
    Familiar,
    FamiliarEstudiante
  };