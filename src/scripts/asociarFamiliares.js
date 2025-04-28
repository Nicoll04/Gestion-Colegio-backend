const Estudiante = require('../models/estudiantesModel');
const Familiar = require('../models/familiaresModel');
const FamiliarEstudiante = require('../models/EstudianteFamiliarModel'); 
const sequelize = require('../config/db');

async function asociarFamiliares() {
    try {
        await sequelize.authenticate(); 
        console.log('Conexión a la base de datos establecida correctamente.');

        const estudiantes = await Estudiante.findAll();

        for (let estudiante of estudiantes) {
            console.log(estudiante.addFamiliar); // Solo para verificar que el método existe
            const familiares = await Familiar.findAll({
                where: {
                    Nro_Documento: estudiante.Nro_Documento 
                }
            });

            for (let familiar of familiares) {
                // Asegúrate de que addFamiliar esté disponible
                if (estudiante.addFamiliar) {
                    await estudiante.addFamiliar(familiar);
                    console.log(`Asociado: Estudiante ${estudiante.Nombre_completo} con Familiar ${familiar.Nombre_completo}`);
                } else {
                    console.error(`Método addFamiliar no encontrado para el estudiante ${estudiante.Nombre_completo}`);
                }
            }
        }

        console.log('Asociación completada.');
    } catch (error) {
        console.error('Error al asociar familiares:', error);
    } finally {
        await sequelize.close(); 
    }
}

asociarFamiliares();
