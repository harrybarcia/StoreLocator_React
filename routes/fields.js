const express = require('express');

const adminFieldsController = require('../controllers/controller_fields');
const authenticateToken = require('../utils/JWT');
const app = express.Router();

app.get('/fields', adminFieldsController.getFields)
app.post('/add-field', adminFieldsController.addNewField)
app.put('/fields', adminFieldsController.updateField)
// app.delete('/fields', authenticateToken, adminController.deleteField)

module.exports = app;