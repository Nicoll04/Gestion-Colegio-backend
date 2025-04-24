const Familiar = require('../models/familiaresModel');
const { FamiliarEstudiante } = require('../models/FamiliarEstudiante');
const { Op } = require('sequelize');


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

exports.agregarOFamiliarExistente = async (req, res) => {
    try {
      const { Nro_Documento, Celular, ID_Estudiante, ...otrosDatos } = req.body;
  
      // Buscar si ya existe el familiar por documento o celular
      let familiar = await Familiar.findOne({
        where: {
          [Op.or]: [
            { Nro_Documento },
            { Celular }
          ]
        }
      });
  
      // Si no existe, lo creamos con ID generado manualmente
      if (!familiar) {
        const randomID = generarID();
        familiar = await Familiar.create({
          ID_Familiar: randomID,
          Nro_Documento,
          Celular,
          ...otrosDatos
        });
      }
  
      // Verificar si ya está asociado al estudiante
      const yaExisteRelacion = await FamiliarEstudiante.findOne({
        where: {
          ID_Familiar: familiar.ID_Familiar,
          ID_Estudiante
        }
      });
  
      if (!yaExisteRelacion) {
        await FamiliarEstudiante.create({
          ID_Familiar: familiar.ID_Familiar,
          ID_Estudiante
        });
      }
  
      res.status(200).json({
        message: yaExisteRelacion ? 'Familiar ya estaba asociado' : 'Familiar asociado correctamente',
        familiar
      });
  
    } catch (error) {
      console.error('Error al asociar familiar:', error);
      res.status(500).json({ error: 'Error al asociar familiar' });
    }
  };
  