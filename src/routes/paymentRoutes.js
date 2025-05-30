const express = require('express');
const router = express.Router();
const axios = require('axios');



const { createPayment } = require('../controllers/paymentController');
const { sendSmsController } = require('../controllers/sensdSmsController'); 

router.post('/createpayment', createPayment);
router.post("/send-sms",sendSmsController);



module.exports = router;