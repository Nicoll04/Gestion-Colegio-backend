const Familiar = require('../models/familiaresModel');
const Estudiante = require('../models/estudiantesModel');
const FamiliarEstudiante = require('../models/EstudianteFamiliarModel');

// Función para generar un ID aleatorio de 6 dígitos
const generarID = () => Math.floor(100000 + Math.random() * 900000);

exports.getAllFamiliares = async (req, res) => {
    try {
        const familiares = await Familiar.findAll();
        res.json(familiares);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFamiliarById = async (req, res) => {
    try {
        const familiar = await Familiar.findByPk(req.params.id);
        if (!familiar) {
            return res.status(404).json({ message: 'Familiar no encontrado' });
        }
        res.json(familiar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
};

exports.createFamiliar = async (req, res) => {
    try {
        const { ID_Estudiante, ...familiarData } = req.body;  // Extraemos el ID del estudiante del body
        
        // Crear un nuevo familiar
        const nuevoFamiliar = await Familiar.create({
            ID_Familiar: generarID(),  // Generamos un ID aleatorio
            ...familiarData
        });

        // Si se proporciona un ID_Estudiante, asociarlo con el familiar
        if (ID_Estudiante) {
            await FamiliarEstudiante.create({
                ID_Familiar: nuevoFamiliar.ID_Familiar,
                ID_Estudiante: ID_Estudiante
            });
        }

        res.status(201).json(nuevoFamiliar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Función para asociar un familiar a un estudiante, evitando duplicados
exports.asociarFamiliarAEstudiante = async (req, res) => {
    const { ID_Estudiante, ID_Familiar } = req.body;

    try {
        // Verificar si ya existe la asociación entre el estudiante y el familiar en la tabla intermedia
        const existeAsociacion = await FamiliarEstudiante.findOne({
            where: {
                ID_Estudiante,
                ID_Familiar
            }
        });

        // Si ya existe, retornamos un mensaje indicando que no se duplicará
        if (existeAsociacion) {
            return res.status(400).json({ message: 'La asociación entre este familiar y estudiante ya existe.' });
        }

        // Si no existe, se crea la asociación
        await FamiliarEstudiante.create({
            ID_Estudiante,
            ID_Familiar
        });

        return res.status(201).json({ message: 'Asociación realizada con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateFamiliar = async (req, res) => {
    try {
        const familiar = await Familiar.findByPk(req.params.id);
        if (!familiar) {
            return res.status(404).json({ message: 'Familiar no encontrado' });
        }
        await familiar.update(req.body);
        res.json({ message: 'Familiar actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFamiliar = async (req, res) => {
    try {
        const familiar = await Familiar.findByPk(req.params.id);
        if (!familiar) {
            return res.status(404).json({ message: 'Familiar no encontrado' });
        }

        // Primero eliminamos las relaciones de la tabla intermedia
        await FamiliarEstudiante.destroy({
            where: { ID_Familiar: req.params.id }
        });

        // Ahora eliminamos el familiar
        await familiar.destroy();
        res.json({ message: 'Familiar eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
