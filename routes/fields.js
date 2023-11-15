const express = require('express');

const adminFieldsController = require('../controllers/controller_fields');
const authenticateToken = require('../utils/JWT');
const app = express.Router();

app.get('/fields', adminFieldsController.getFields)
app.post('/add-field', adminFieldsController.updateField)
app.delete('/delete-fields/:id', adminFieldsController.deleteField)

module.exports = app;