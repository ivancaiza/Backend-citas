const express = require('express');
const router = express.Router();
const { getMedicos } = require('../controllers/medicosController');

router.get('/', getMedicos);

module.exports = router;