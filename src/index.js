const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // Conexión a la BD
const estudiantesRoutes = require('./routes/estudiantesRoutes'); // Importar rutas de estudiantes
const cursosRoutes = require('./routes/cursosRoutes'); //Importar rutas de cursos
const familiaresRoutes = require('./routes/familiaresRoutes'); //Importar rutas de familiares
const profesoresRoutes = require('./routes/profesoresRoutes');//Importar rutas de profesores 
const authRoutes = require('./routes/authRoutes'); //Importa rutas de usuarios
const { Curso, Estudiante } = require('./models/associations'); // Cargar relaciones después de definir modelos



const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  }));
app.use(express.json());

// Rutas
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/cursos', cursosRoutes); 
app.use('/api/familiares', familiaresRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/auth', authRoutes);

// Verificar conexión a la base de datos y sincronizar modelos
sequelize.sync()
    .then(() => console.log('Base de datos conectada y sincronizada'))
    .catch(err => console.error('Error al conectar la base de datos:', err));

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
