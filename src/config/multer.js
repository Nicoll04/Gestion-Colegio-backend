const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento en memoria (para subir directamente a Cloudinary)
const storage = multer.memoryStorage();

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPG, JPEG, PNG)'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
