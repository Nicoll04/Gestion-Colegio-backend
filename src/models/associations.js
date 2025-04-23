const Curso = require('./cursosModel');
const Estudiante = require('./estudiantesModel');
const Familiar = require('./familiaresModel');
const FamiliarEstudiante = require('./FamiliarEstudianteModel');

// Relaciones entre Curso y Estudiante
Curso.hasMany(Estudiante, { foreignKey: 'ID_Curso', as: 'estudiantes' });
Estudiante.belongsTo(Curso, { foreignKey: 'ID_Curso', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Relaciones entre Estudiante y Familiar (Muchos a Muchos)
Estudiante.belongsToMany(Familiar, {
  through: FamiliarEstudiante,
  foreignKey: 'ID_Estudiante',
  otherKey: 'ID_Familiar',
  as: 'familiares',  // Este es el alias para acceder a los familiares desde el estudiante
});

Familiar.belongsToMany(Estudiante, {
  through: FamiliarEstudiante,
  foreignKey: 'ID_Familiar',
  otherKey: 'ID_Estudiante',
  as: 'estudiantes',  // Este es el alias para acceder a los estudiantes desde el familiar
});

module.exports = { Curso, Estudiante, Familiar, FamiliarEstudiante };
