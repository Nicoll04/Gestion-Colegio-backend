const Curso = require('./cursosModel');
const Estudiante = require('./estudiantesModel');
const Familiar = require('./familiaresModel');
const Profesor = require('./profesoresModel');

// Curso - Estudiante
Curso.hasMany(Estudiante, { foreignKey: 'ID_Curso', as: 'estudiantes' });
Estudiante.belongsTo(Curso, { foreignKey: 'ID_Curso', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Estudiante - Familiar
Estudiante.hasMany(Familiar, { foreignKey: "ID_Estudiante", as: "familiares" });
Familiar.belongsTo(Estudiante, { foreignKey: "ID_Estudiante", as: "estudiante" });

// Nuevo: Curso - Profesor director
Curso.belongsTo(Profesor, { foreignKey: 'ID_ProfesorDirector', as: 'director' });
Profesor.hasOne(Curso, { foreignKey: 'ID_ProfesorDirector', as: 'cursoDirigido' });

module.exports = { Curso, Estudiante, Familiar };
