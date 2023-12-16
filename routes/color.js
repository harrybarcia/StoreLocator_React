const express = require('express');

const adminColorsController = require('../controllers/controller_color');
const app = express.Router();
console.log('here');
app.get('/all-colors',adminColorsController.getFieldsColors)
app.get('/color/:id',adminColorsController.getFieldColors)
app.post('/add-colors',adminColorsController.addFieldsColors)


module.exports = app;