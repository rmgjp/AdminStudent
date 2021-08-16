const express = require('express');
const router = express.Router();
const controladorGrupo = require('../controllers/grupo-controller');
var configFile = require('../config/userconfig.json')
const fs = require('fs');
const path = require('path');

router.use(function(req, res, next) {
    next();
});

router.get('/', controladorGrupo.renderAllGroups);


router.get('/about', (req, res) => {
    res.render('About')
});

router.put('/set-config', async (req, res) =>{
    const {nombre, clave, correo, calfi, valequipo} = req.body;
    configFile.nombre = nombre;
    configFile.clave = clave;
    configFile.correo = correo;
    configFile.califi = calfi;
    configFile.valequipo = valequipo;

    await fs.writeFileSync(path.join(__dirname, '../config/userconfig.json'), JSON.stringify(configFile, null, 2), function writeJSON(err){
        if (err) return console.log(err);
        console.log(JSON.stringify(configFile));
        console.log('writing');
    });

    console.log("Datos Guardados: " + configFile);
    res.redirect('/');
});

router.get('/filtro/:estado', controladorGrupo.getAllGroupsByState);
module.exports = router;