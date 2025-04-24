const Familiar = require('../models/familiaresModel');
const Estudiante = require('../models/estudiantesModel');
const FamiliarEstudiante = require('../models/FamiliarEstudianteModel');
const { Op } = require('sequelize');


// Función para generar un ID aleatorio de 6 dígitos
const generarID = () => Math.floor(100000 + Math.random() * 900000);

exports.getAllFamiliares = async (req, res) => {
    try {
        const familiares = await Familiar.findAll({
            include: {
                model: Estudiante,
                as: 'estudiantes',  // Alias que definimos en las asociaciones
                through: { attributes: [] } // Evita que se incluya la tabla intermedia en la respuesta
            }
        });
        res.json(familiares);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFamiliarById = async (req, res) => {
    try {
        const familiar = await Familiar.findByPk(req.params.id, {
            include: {
                model: Estudiante,
                as: 'estudiantes',
                through: { attributes: [] }
            }
        });
        if (!familiar) {
            return res.status(404).json({ message: 'Familiar no encontrado' });
        }
        res.json(familiar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const limpiarCelular = (numero) => {
    return numero.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
};

exports.createFamiliar = async (req, res) => {
    try {
        const { ID_Estudiante, Representante, Parentesco, Nombre_completo, Nro_Documento, Direccion_Residencia, Celular, Email } = req.body;
        const celularLimpio = limpiarCelular(Celular);

        // Buscar si ya existe un familiar por documento o celular
        let familiar = await Familiar.findOne({
            where: {
                [Op.or]: [
                    { Nro_Documento },
                    { Celular: celularLimpio }
                ]
            }
        });

        // Si no existe, lo creamos
        if (!familiar) {
            const randomID = generarID();
            familiar = await Familiar.create({
                ID_Familiar: randomID,
                Representante,
                Parentesco,
                Nombre_completo,
                Nro_Documento,
                Direccion_Residencia,
                Celular: celularLimpio,
                Email
            });
        }

        // Si se pasa un estudiante, verificamos si ya está asociado
        if (ID_Estudiante) {
            const yaAsociado = await FamiliarEstudiante.findOne({
                where: {
                    ID_Estudiante,
                    ID_Familiar: familiar.ID_Familiar
                }
            });

            // Si no está asociado aún, lo asociamos
            if (!yaAsociado) {
                await familiar.addEstudiante(ID_Estudiante);
            }
        }

        res.json(familiar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verificarFamiliar = async (req, res) => {
    try {
        const { Nro_Documento, Celular } = req.query;
        const celularLimpio = Celular ? limpiarCelular(Celular) : null;

        const familiar = await Familiar.findOne({
            where: {
                [Op.or]: [
                    Nro_Documento ? { Nro_Documento } : null,
                    celularLimpio ? { Celular: celularLimpio } : null,
                ].filter(Boolean) 
            }
        });

        if (familiar) {
            res.json(familiar);
        } else {
            res.status(404).json({ message: "Familiar no encontrado" });
        }
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

        // Actualizamos los campos del familiar
        await familiar.update(req.body);

        // Si se pasa un ID_Estudiante en el cuerpo de la solicitud, agregamos la relación si no existe
        if (req.body.ID_Estudiante) {
            const estudiante = await Estudiante.findByPk(req.body.ID_Estudiante);
            if (!estudiante) {
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }

            // Verificamos si ya está asociado
            const yaAsociado = await FamiliarEstudiante.findOne({
                where: {
                    ID_Estudiante: estudiante.ID_Estudiante,
                    ID_Familiar: familiar.ID_Familiar
                }
            });

            if (!yaAsociado) {
                await familiar.addEstudiante(estudiante);
            }
        }

        res.json({ message: 'Familiar actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.asociarFamiliarEstudiante = async (req, res) => {
    try {
        const { ID_Familiar, ID_Estudiante } = req.body;

        if (!ID_Familiar || !ID_Estudiante) {
            return res.status(400).json({ message: "ID_Familiar e ID_Estudiante son requeridos" });
        }

        const familiar = await Familiar.findByPk(ID_Familiar);
        const estudiante = await Estudiante.findByPk(ID_Estudiante);

        if (!familiar || !estudiante) {
            return res.status(404).json({ message: "Familiar o Estudiante no encontrado" });
        }

        const yaAsociado = await FamiliarEstudiante.findOne({
            where: {
                ID_Estudiante,
                ID_Familiar
            }
        });

        if (!yaAsociado) {
            await familiar.addEstudiante(ID_Estudiante);
        }

        res.json({ message: "Familiar asociado correctamente con el estudiante" });
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

        // Eliminar la relación con los estudiantes antes de eliminar el familiar
        await familiar.setEstudiantes([]);

        // Eliminar el familiar
        await familiar.destroy();
        res.json({ message: 'Familiar eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
