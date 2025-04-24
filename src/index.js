const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); 
const estudiantesRoutes = require('./routes/estudiantesRoutes'); 
const cursosRoutes = require('./routes/cursosRoutes'); 
const familiaresRoutes = require('./routes/familiaresRoutes'); 
const profesoresRoutes = require('./routes/profesoresRoutes');
const authRoutes = require('./routes/authRoutes'); 
const { Curso, Estudiante } = require('./models/associations'); 



const app = express();

// Middleware
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://gestionsantamariac.vercel.app"
    ],
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
