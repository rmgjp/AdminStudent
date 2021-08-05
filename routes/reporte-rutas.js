const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte-controller');

router.get("/generar-reporte", reporteController.renderFormReporte);
router.post("/generar-reporte", reporteController.generarReporte);


module.exports = router;

