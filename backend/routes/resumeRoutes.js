const express = require('express');
const router = express.Router();
const { savePersonalInfo } = require('../controllers/resumeController');

router.post('/personal', savePersonalInfo);

module.exports = router;