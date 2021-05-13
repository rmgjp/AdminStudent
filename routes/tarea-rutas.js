const express = require('express');
const router = express.Router();

router.get('/grupo/actividades/:idgrupo', (req,res)=>{
    res.render('grupo/vista-grupo-actividades');
});

module.exports = router;