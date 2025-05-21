const Curso = require('../models/cursosModel');
const Estudiante = require('../models/estudiantesModel');

// Lista de correos autorizados
const correosAutorizados = [
    'Romero_Rocio276@isantamariac.edu.co',
    'Gil_Jenny431@isantamariac.edu.co',
    'yireth_segura177@isantamariac.edu.co',
    'sandra_ramirez207@isantamariac.edu.co',
    'liliana_gonzalez629@isantamariac.edu.co'
];


// Obtener estudiantes por curso
exports.getEstudiantesByCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { Rol, Correo } = req.usuario;

        const curso = await Curso.findByPk(id, {
            include: {
                model: Estudiante,
                as: 'estudiantes'
            }
        });

        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        // Restricción para profesores
        if (Rol === 'profesor') {
            if (!correosAutorizados.includes(Correo)) {
                return res.status(403).json({ error: 'No tienes permisos para ver los estudiantes de este curso' });
            }

            if (!['Kinder', 'Transición', 'Primero', 'Segundo', 'Tercero'].includes(curso.Nombre_curso)) {
                return res.status(403).json({ error: 'No puedes acceder a estudiantes de este curso' });
            }
        }

        res.json(curso.estudiantes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los cursos
exports.getAllCursos = async (req, res) => {
    try {
        const { Rol, Correo } = req.usuario;

        let cursos;

        if (Rol === 'profesor') {
            if (!correosAutorizados.includes(Correo)) {
                return res.status(403).json({ error: 'No tienes permisos para ver estos cursos' });
            }

            cursos = await Curso.findAll({
                where: {
                    Nombre_curso: ['Kinder', 'Transición', 'Primero', 'Segundo', 'Tercero']
                }
            });
        } else {
            cursos = await Curso.findAll();
        }

        res.json(cursos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un curso por ID
exports.getCursoById = async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.json(curso);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo curso
exports.createCurso = async (req, res) => {
    try {
        const { Nombre_curso, Grado, ID_ProfesorDirector } = req.body;

        if (!Nombre_curso || !Grado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (!['Preescolar', 'Primaria', 'Bachillerato'].includes(Grado)) {
            return res.status(400).json({ error: 'Grado no válido' });
        }

        const nuevoCurso = await Curso.create({ Nombre_curso, Grado, ID_ProfesorDirector });

        res.json({ message: 'Curso creado', id: nuevoCurso.ID_Curso });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Actualizar un curso por ID
exports.updateCurso = async (req, res) => {
    try {
        const { Nombre_curso, Grado, ID_ProfesorDirector } = req.body;

        if (!Nombre_curso || !Grado) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        if (!["Preescolar", "Primaria", "Bachillerato"].includes(Grado)) {
            return res.status(400).json({ error: "Grado no válido" });
        }

        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        await curso.update({ Nombre_curso, Grado, ID_ProfesorDirector });

        res.json({ message: "Curso actualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Eliminar un curso por ID
exports.deleteCurso = async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        await curso.destroy();
        res.json({ message: 'Curso eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
