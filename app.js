/**
 * Archivo para configuración del servidor ExpressJS
 * @type {e | () => Express)}
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const dbcreator = require('./controllers/db');
const sessionStore = new session.MemoryStore;
const cookieParser = require('cookie-parser');

const options = {
    mode: 'whitelist',
    allow: ['127.0.0.1'],
    deny: [],
};

//Inicialización de Express
let app = express();

dbcreator.initialize();


//Configuración del motor de vista
app.set('views', path.join(__dirname , 'views'));
//Se declara que se utilizará archivos hbs para su compatibilidad con Handlebars Express

//Middlewares
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended : false}));
app.use(methodOverride('_method'));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.info_msg = req.flash('info_msg');
    next();
});

//Configuración de rutas estaticas
app.use(express.static(path.join(__dirname + 'public')));
app.use('/css', express.static(path.join(__dirname , 'node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname , 'node_modules/font-awesome/css')));
app.use('/css', express.static(path.join(__dirname , 'node_modules/bootstrap-icons/font')));
app.use('/icons', express.static(path.join(__dirname ,'node_modules/bootstrap-icons/icons')));
app.use('/fonts', express.static(path.join(__dirname , 'node_modules/font-awesome/fonts')));
app.use('/js', express.static(path.join(__dirname , 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname , 'node_modules/bootstrap-table/dist')));
app.use('/js', express.static(path.join(__dirname , 'node_modules/popper.js/dist')))
app.use('/js', express.static(path.join(__dirname , 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname , 'helpers')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/x-editable-bs4/dist')));
app.use('/js',express.static(path.join(__dirname, 'node_modules/bs-custom-file-input/dist')));
app.use('/img', express.static(path.join(__dirname , 'public/img')));
app.use('/cssc', express.static(path.join(__dirname , 'public/css')));
app.use('/font', express.static(path.join(__dirname , 'public/fonts')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/morris.js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/raphael')))

//Requerimos los archivos de las rutas.
app.use(require('./routes/index'));
app.use(require('./routes/asistencia-rutas'));
app.use(require('./routes/alumno-rutas'));
app.use(require('./routes/actividad-rutas'));
app.use(require('./routes/grupos-rutas'));
app.use(require('./routes/calificaciones-rutas'));
app.use(require('./routes/tema-rutas'));
app.use(require('./routes/equipo-rutas'));
app.use(require('./routes/reporte-rutas'));


//Inicialización de Express Handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require(path.join(__dirname,'/helpers/helperhbs')),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));










//Creación de una función para notificar que no se encuentra un directorio.
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});




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
const server = app.listen(5000);


module.exports = app;