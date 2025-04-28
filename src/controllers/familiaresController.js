const Familiar = require('../models/familiaresModel');

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
        const randomID = generarID();
        const nuevoFamiliar = await Familiar.create({
            ID_Familiar: randomID,
            ...req.body
        });
        res.json(nuevoFamiliar);
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
        await familiar.destroy();
        res.json({ message: 'Familiar eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};