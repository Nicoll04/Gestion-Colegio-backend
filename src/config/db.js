const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

sequelize.authenticate()
    .then(() => console.log('Conectado a MySQL con Sequelize'))
    .catch(err => console.error('Error de conexión a MySQL:', err));

module.exports = sequelize;
