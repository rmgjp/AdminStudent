const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('Index')
});

router.get('/about', (req, res) => {
    res.render('About')
});

module.exports = router;