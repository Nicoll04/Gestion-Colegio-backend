const Profesor = require('../models/profesoresModel');
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

// Configurar multer para manejar imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.single("Foto");



// Obtener todos los profesores
exports.getAllProfesores = async (req, res) => {
    try {
        const profesores = await Profesor.findAll();
        res.json(profesores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un profesor por ID
exports.getProfesorById = async (req, res) => {
    try {
        const profesor = await Profesor.findByPk(req.params.id);
        if (!profesor) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.json(profesor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Función para subir imagen a Cloudinary y devolver la URL
const subirImagenCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profesores" },
            (error, result) => {
                if (error) {
                    console.error("⛔ Error al subir imagen:", error);
                    reject(error);
                } else {
                    console.log("✅ Imagen subida correctamente:", result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

// Crear un nuevo profesor
exports.createProfesor = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en el backend:", req.body);
        console.log("📸 Archivo recibido:", req.file);

        // Generar un ID aleatorio
        const randomID = Math.floor(100000 + Math.random() * 900000);
        let imageUrl = null;

        // Si hay un archivo, subirlo a Cloudinary
        if (req.file) {
            imageUrl = await subirImagenCloudinary(req.file.buffer);
        } else if (req.body.Foto) {
            imageUrl = req.body.Foto; // Si viene como URL, usarla directamente
        } else {
            console.warn("⚠️ Advertencia: No se recibió imagen.");
        }

        // Crear profesor en la BD con la imagen
        const nuevoProfesor = await Profesor.create({
            ID_Profesores: randomID,
            ...req.body,
            Foto: imageUrl // Ahora la URL de la imagen se guarda correctamente
        });

        console.log("✅ Profesor creado correctamente:", nuevoProfesor);

        res.status(201).json({
            message: "Profesor creado correctamente",
            profesor: nuevoProfesor
        });

    } catch (err) {
        console.error("⛔ Error al crear profesor:", err);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un profesor por ID
exports.updateProfesor = async (req, res) => {
    try {
        const profesor = await Profesor.findByPk(req.params.id);
        if (!profesor) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        let imageUrl = profesor.Foto;
        if (req.file) {
            imageUrl = await subirImagenCloudinary(req.file.buffer);
        } else if (req.body.Foto) {
            imageUrl = req.body.Foto;
        }
        await profesor.update({ ...req.body, Foto: imageUrl });
        res.json({ message: 'Profesor actualizado', profesor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un profesor por ID
exports.deleteProfesor = async (req, res) => {
    try {
        const profesor = await Profesor.findByPk(req.params.id);
        if (!profesor) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        await profesor.destroy();
        res.json({ message: 'Profesor eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

