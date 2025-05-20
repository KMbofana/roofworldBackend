const express = require('express');
const sendQuotation = require('../controllers/SendEmails');
const projectCalculator = require('../controllers/ProjectCalculator');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send('Welcome To Roof World 🎉🎊🎇🛠🔨');
})

router.post('/request_quotation',sendQuotation.fileUploadHandler("file"))

router.post('/simple_calculator', projectCalculator.simpleCalculation)
router.post('/subscribe_for_news', sendQuotation.subscribeForNews)

module.exports = router
