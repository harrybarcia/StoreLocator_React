const express = require('express');

const adminColorsController = require('../controllers/controller_color');
const app = express.Router();
console.log('here');
app.get('/colors',adminColorsController.getFieldsColors)

module.exports = app;