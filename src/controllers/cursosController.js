const Curso = require('../models/cursosModel');
const Estudiante = require('../models/estudiantesModel');


// Obtener estudiantes por curso
exports.getEstudiantesByCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Curso.findByPk(id, {
            include: {
                model: Estudiante,
                as: 'estudiantes'
            }
        });

        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        res.json(curso.estudiantes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los cursos
exports.getAllCursos = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
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
        const { Nombre_curso, Grado } = req.body;
        if (!Nombre_curso || !Grado) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        if (!['Preescolar', 'Primaria', 'Bachillerato'].includes(Grado)) {
            return res.status(400).json({ error: 'Grado no válido' });
        }
        const nuevoCurso = await Curso.create({ Nombre_curso, Grado });
        res.json({ message: 'Curso creado', id: nuevoCurso.ID_Curso });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};    

// Actualizar un curso por ID
exports.updateCurso = async (req, res) => {
    try {
        const { Nombre_curso, Grado } = req.body;

        // Validar si los campos están presentes
        if (!Nombre_curso || !Grado) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Validar que el Grado sea uno de los valores permitidos
        if (!["Preescolar", "Primaria", "Bachillerato"].includes(Grado)) {
            return res.status(400).json({ error: "Grado no válido" });
        }

        // Buscar el curso por ID
        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        // Actualizar el curso con los nuevos datos
        await curso.update({ Nombre_curso, Grado });

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
