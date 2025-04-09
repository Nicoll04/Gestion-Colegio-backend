const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Acceso denegado: Token no proporcionado o inválido.');
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o inválido.' });
    }

    const token = authHeader.split(' ')[1]; 
    console.log('Token recibido:', token); 

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Usuario verificado:', verificado); 
        req.usuario = verificado;
        next();
    } catch (err) {
        console.log('Error al verificar token:', err.message);
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

exports.verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const { Rol } = req.usuario;

        if (!Rol || !rolesPermitidos.includes(Rol)) {
            return res.status(403).json({ error: "Acceso denegado: rol no autorizado o no asignado." });
        }

        next();
    };
};
