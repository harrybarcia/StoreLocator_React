const express = require('express');

const adminColorsController = require('../controllers/controller_color');
const app = express.Router();
console.log('here');
app.get('/colors',adminColorsController.getFieldsColors)
app.post('/add-colors',adminColorsController.addFieldsColors)
app.delete('/colors/:id', adminColorsController.deleteFieldColor); // New delete route


module.exports = app;