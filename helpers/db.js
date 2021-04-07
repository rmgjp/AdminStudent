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

initialize();

async function initialize() {
    // Se obtienen las credenciales de la base de datos
    const { host, port, user, password, database } = config.registrobd;
    // Se crea la conexión a MariaDB/MySQL
    const connection = await mariadb.createConnection({ host, port, user, password });
    //Ejecucion del query para crear la base de datos, en caso de que no exista
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    // Llamada a Sequelize para la creación de las tablas.
    const sequelize = new Sequelize(database, user, password, { dialect: 'mariadb' });

    // init models and add them to the exported db object
    //TODO: definir los modelos de las tablas y aplicarlos para su creación
    db.Alumno = require('../models/alumno')(sequelize);
    db.Grupo = require('../models/grupo')(sequelize);
    db.AlumnoGrupo = require('../models/alumnogrupo')(sequelize);


    // sync all models with database
    await sequelize.sync();
}