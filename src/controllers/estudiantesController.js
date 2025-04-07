const Estudiante = require('../models/estudiantesModel');
const Curso = require('../models/cursosModel');
const Familiar = require('../models/familiaresModel');
const cloudinary = require('../config/cloudinaryConfig'); 
const multer = require("multer");

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single("Foto");

exports.getEstudiantesConFamiliares = async (req, res) => {
        try {
            const estudiantes = await Estudiante.findAll({
                include: [
                    {
                        model: Familiar,
                        as: "familiares",
                        attributes: ["ID_Familiar", "nombre_completo", "parentesco"],
                    },
                ],
            });
            res.json(estudiantes);
        } catch (error) {
            console.error("Error al obtener los estudiantes con familiares:", error);
            res.status(500).json({ error: "Error al obtener los estudiantes con familiares" });
        }
};

// Obtener todos los estudiantes
exports.getAllEstudiantes = async (req, res) => {
        try {
            const estudiantes = await Estudiante.findAll();
            res.json(estudiantes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
};

// Obtener un estudiante por ID
exports.getEstudianteById = async (req, res) => {
        try {
            const estudiante = await Estudiante.findByPk(req.params.id, {
                include: { model: Familiar, as: "familiares" } // Incluir familiares
            });
    
            if (!estudiante) {
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
    
            res.json(estudiante);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
};

// Valores permitidos para Tipo_documento
const TIPOS_DOCUMENTO = ["TI", "CC", "NUIP"];

// Crear un nuevo estudiante
exports.createEstudiante = async (req, res) => {
        try {
            const { ID_Curso, Tipo_documento } = req.body;
    
            console.log("📥 Datos recibidos en el backend:", req.body);
    
            // Verificar si el curso existe
            if (ID_Curso) {
                const cursoExiste = await Curso.findByPk(ID_Curso);
                if (!cursoExiste) {
                    return res.status(400).json({ error: "El curso no existe" });
                }
            }
    
            // Validar Tipo_documento
            if (!TIPOS_DOCUMENTO.includes(Tipo_documento)) {
                return res.status(400).json({ error: "Tipo de documento inválido. Debe ser TI, CC o NUIP." });
            }
    
            // Generar ID aleatorio
            const randomID = Math.floor(100000 + Math.random() * 900000);
    
            let imageUrl = req.body.Foto || null;
    
            if (!imageUrl) {
                console.warn("⚠️ Advertencia: No se recibió URL de imagen.");
            }
    
            // Crear estudiante en la BD con la URL de la imagen (si existe)
            const estudiante = await Estudiante.create({
                ID_estudiante: randomID,
                ...req.body,
                Foto: imageUrl 
            });
    
            console.log("✅ Estudiante creado correctamente:", estudiante);
    
            res.status(201).json({
                mensaje: "Estudiante creado correctamente",
                estudiante
            });
    
        } catch (error) {
            console.error("⛔ Error al crear estudiante:", error);
            res.status(500).json({ error: error.message });
        }
};

// Actualizar un estudiante por ID
exports.updateEstudiante = async (req, res) => {
        try {
            console.log("\ud83d\udce5 Datos recibidos en el backend:", req.body);
    
            const estudiante = await Estudiante.findByPk(req.params.id);
            if (!estudiante) {
                return res.status(404).json({ error: "Estudiante no encontrado" });
            }
    
            console.log("\ud83d\udd0d Foto actual en la BD antes de actualizar:", estudiante.Foto);
    
            let imageUrl = estudiante.Foto; // Mantener la imagen actual si no se envía una nueva
    
            if (req.file) {
                console.log("\ud83d\udcf8 Subiendo nueva imagen a Cloudinary...");
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "estudiantes" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    );
                    stream.end(req.file.buffer);
                });
    
                imageUrl = result.secure_url;
                console.log("\u2705 Imagen subida con éxito:", imageUrl);
            } else if (req.body.Foto) {
                console.log("\ud83d\uddbc\ufe0f Se recibió una nueva URL de imagen en el body:", req.body.Foto);
                imageUrl = req.body.Foto;
            }
    
            console.log("\ud83d\uddbc\ufe0f URL de la imagen antes de actualizar en BD:", imageUrl);
    
            // Actualizar solo la foto
            await estudiante.update({ Foto: imageUrl });
    
            // Verificar si la actualización fue exitosa
            const estudianteActualizado = await Estudiante.findByPk(req.params.id);
            console.log("\u2705 Foto en la BD después de actualizar:", estudianteActualizado.Foto);
    
            res.json(estudianteActualizado);
        } catch (error) {
            console.error("\u26d4\ufe0f Error al actualizar estudiante:", error);
            res.status(500).json({ error: error.message });
        }
};

// Eliminar un estudiante por ID

exports.deleteEstudiante = async (req, res) => {
        try {
            const estudiante = await Estudiante.findByPk(req.params.id);
            if (!estudiante) {
                return res.status(404).json({ error: "Estudiante no encontrado" });
            }
    
            if (estudiante.Foto) {
                const publicId = estudiante.Foto.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
    
            await estudiante.destroy();
            res.json({ message: "Estudiante eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};
