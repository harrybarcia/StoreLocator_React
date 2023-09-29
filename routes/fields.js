const express = require('express');

const adminFieldsController = require('../controllers/controller_fields');
const authenticateToken = require('../utils/JWT');
const app = express.Router();

app.get('/fields', authenticateToken, adminFieldsController.getFields)
app.post('/add-fields', authenticateToken, adminFieldsController.addFields)
// app.put('/fields', authenticateToken, adminController.updateField)
// app.delete('/fields', authenticateToken, adminController.deleteField)

module.exports = app;