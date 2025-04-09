const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registrar = async (req, res) => {
    try {
        console.log('REQ BODY:', req.body);  
        const { Nombre, Correo, Contraseña, Rol } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { Correo } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(Contraseña, 10);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            Nombre,
            Correo,
            Contraseña: hashedPassword,
            Rol
        });

        res.json({ message: 'Usuario registrado exitosamente', id: nuevoUsuario.ID_Usuario });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { Correo, Contraseña } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ where: { Correo } });
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        // Comparar contraseña
        const esValida = await bcrypt.compare(Contraseña, usuario.Contraseña);
        if (!esValida) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        // Generar token JWT con el rol del usuario
        const token = jwt.sign(
            { ID_Usuario: usuario.ID_Usuario, Rol: usuario.Rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 🔹 Ahora enviamos el token Y el rol del usuario
        res.json({ token, rol: usuario.Rol });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.googleLogin = async (req, res) => {
    const { googleToken } = req.body;

    if (!googleToken) {
        return res.status(400).json({ error: 'Token de Google no recibido' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let usuario = await Usuario.findOne({ where: { Correo: email } });

        let esNuevo = false;

        if (!usuario) {
            usuario = await Usuario.create({
                Nombre: name,
                Correo: email,
                Contraseña: await bcrypt.hash(Date.now().toString(), 10),
                Rol: null 
            });
            esNuevo = true;
        }

        const token = jwt.sign(
            { ID_Usuario: usuario.ID_Usuario, Rol: usuario.Rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            rol: usuario.Rol,
            nombre: usuario.Nombre,
            esNuevo
        });

    } catch (err) {
        console.error('Error en login con Google:', err);
        res.status(401).json({ error: 'Token inválido de Google' });
    }
};


exports.asignarRol = async (req, res) => {
    const { ID_Usuario, Rol } = req.body;

    if (!['admin', 'secretaria', 'coordinacion'].includes(Rol)) {
        return res.status(400).json({ error: 'Rol no válido' });
    }

    try {
        const usuario = await Usuario.findByPk(ID_Usuario);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        usuario.Rol = Rol;
        await usuario.save();

        res.json({ message: 'Rol asignado correctamente', rol: usuario.Rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

