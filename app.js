/**
 * Archivo para configuración del servidor ExpressJS
 * @type {e | () => Express)}
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const dbcreator = require('./helpers/db');
const firstRun = require('electron-first-run');




//Inicialización de Express
var app = express();


//Configuración del motor de vista
app.set('views', path.join(__dirname , 'views'));
//Se declara que se utilizará archivos hbs para su compatibilidad con Handlebars Express
app.set('view engine', '.hbs');

//
app.use(express.urlencoded({extended : false}));
app.use(methodOverride('_method'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Configuración de rutas estaticas
app.use(express.static(path.join(__dirname + 'public')));


app.use('/css', express.static(path.join(__dirname , 'node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname , 'node_modules/font-awesome/css')));
app.use('/css', express.static(path.join(__dirname , 'node_modules/bootstrap-icons/font')));
app.use('/icons', express.static(path.join(__dirname ,'node_modules/bootstrap-icons/icons')));
app.use('/js', express.static(path.join(__dirname , 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname , 'node_modules/bootstrap-table/dist')));
app.use('/js', express.static(path.join(__dirname , 'node_modules/popper.js/dist')))
app.use('/js', express.static(path.join(__dirname , 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname , 'helpers')));
app.use('/js',express.static(path.join(__dirname, 'node_modules/bs-custom-file-input/dist')));
app.use('/img', express.static(path.join(__dirname , 'public/img')));


//Inicialización de Express Handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.set('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require(path.join(__dirname,'/helpers/helperhbs')),
    extname: '.hbs'
}));


//Requerimos los archivos de las rutas.
app.use(require('./routes/index'));
app.use(require('./routes/asistencia-rutas'));
app.use(require('./routes/alumno-rutas'));
app.use(require('./routes/actividad-rutas'));
app.use(require('./routes/grupos-rutas'));
app.use(require('./routes/calificaciones-rutas'));
app.use(require('./routes/tema-rutas'));




app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//Creación de una función para notificar que no se encuentra un directorio.
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

dbcreator.initialize();

const isFirstRun = firstRun()
console.log(isFirstRun);

// Manejadores de erores


// Este metodo muestra los errores generados en la ejecución de la app en el desarrollo.
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// Este metodo muestra los errores generados en la ejecución de la app en el desarrollo, no son visibles para el usuario.
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//Inicializacion del servidor para su posterior presentación por medio de Electron.
const server = app.listen(5000, () => console.log(`Express server listening on port 5000`));


module.exports = app;