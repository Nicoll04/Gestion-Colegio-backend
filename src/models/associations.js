const Curso = require('./cursosModel');
const Estudiante = require('./estudiantesModel');
const Familiar = require('./familiaresModel');

// Relaciones entre Curso y Estudiante
Curso.hasMany(Estudiante, { foreignKey: 'ID_Curso', as: 'estudiantes' });
Estudiante.belongsTo(Curso, { foreignKey: 'ID_Curso', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Relaciones entre Estudiante y Familiar
Estudiante.hasMany(Familiar, { foreignKey: "ID_Estudiante", as: "familiares" });
Familiar.belongsTo(Estudiante, { foreignKey: "ID_Estudiante", as: "estudiante" });

module.exports = { Curso, Estudiante, Familiar };
