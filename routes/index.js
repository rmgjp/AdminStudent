const express = require('express');
const router = express.Router();

const controladorGrupo = require('../controllers/grupo');

router.use(function(req, res, next) {
    next();
});

router.get('/', controladorGrupo.getAllGrupos);


router.get('/about', (req, res) => {
    res.render('About')
});

module.exports = router;