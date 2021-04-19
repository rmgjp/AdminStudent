/**
 * Archivo de configuración encargado de crear la base de datos en caso de que no exista.
 * depende de /config/config.json para obtener las credenciales.
 *
 * Se ejecuta al inicio de la aplicación.
 */
const config = require('../config/config.json');
const mariadb = require('mariadb/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};


module.exports = {
    async initialize() {
        // Se obtienen las credenciales de la base de datos
        const { host, port, user, password, database } = config.registrobd;
        // Se crea la conexión a MariaDB/MySQL
        const connection = await mariadb.createConnection({ host, port, user, password });
        //Ejecucion del query para crear la base de datos, en caso de que no exista
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        // Llamada a Sequelize para la creación de las tablas.
        const sequelize = new Sequelize(database, user, password, { dialect: 'mariadb' });


        db.alumno = require('../models/alumno')(sequelize, Sequelize);
        db.grupo = require('../models/grupo')(sequelize, Sequelize);
        db.alumnogrupo = require('../models/alumnogrupo')(sequelize, Sequelize);
        db.tema = require('../models/tema')(sequelize, Sequelize);
        db.tarea = require('../models/tarea')(sequelize, Sequelize);
        db.calificacion = require('../models/calificacion')(sequelize, Sequelize);
        db.asistencia = require('../models/asistencia')(sequelize, Sequelize);

        // sync all models with database
        await sequelize.sync();

    }
}