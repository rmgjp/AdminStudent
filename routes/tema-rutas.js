const express = require('express');
const controladorTema = require('../controllers/tema-controller');
const router = express.Router();
const multer = require('multer');
const path = require('path')

router.use(function (req, res, next) {
    next();
});
/**
 * se define la constante storage pare definir los terminos al leer/cargar un archivo**/
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/doc'),
    filename: (req, file, cb) => {
        cb(null, file.originalname.toString().replace(' ', ''));
    }
});
const load = (multer({
    storage: storage
}));


//Ruta para visualizar
router.get('/grupo/temas/:idgrupo', controladorTema.getTopicByGroup);

router.get('/tema/nuevo-tema/:idgrupo', (req,res) =>{
    res.render('tema/tema-nuevo', {idgrupo: req.params.idgrupo});
});


router.post('/tema/nuevo-tema/:idgrupo', controladorTema.saveTopicsAndActivities);

router.put('/tema/editar-tema/:idgrupo/:idtema', controladorTema.editTopic);

router.delete('/tema/eliminar-tema/:idgrupo/:idtema', controladorTema.deleteTopic);

router.post('/tema/importar/:idgrupo', load.single('archivo'),async (req,res)=>{
    let file = req.file;
    let archivo = file.originalname.toString().replace(' ', '');
    res.redirect('/tema/lista-temas/' + req.params.idgrupo + '/' + archivo);
});

router.get('/tema/lista-temas/:idgrupo/:archivo', controladorTema.getTopicsByFile);

router.post('/tema/lista-temas/:idgrupo', controladorTema.saveTopicByGrid);

module.exports = router;