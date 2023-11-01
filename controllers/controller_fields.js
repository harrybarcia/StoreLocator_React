const Field=require('../models/model_Field')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 


exports.getFields = async (req, res, next) => {
      console.log("here in fields controller")
      const data = await Field.find();
      
      return res.status(200).json(data)
  };

exports.updateField = async (req, res, next) => {
  console.log("in update controller field")
}

// Controller function to add a new field
exports.addNewField = async (req, res) => {
  try {
    const fields = req.body; // Assuming the request body contains an array of field objects
    console.log(req.body)
    // Create an array to store the newly created documents
    const savedDocuments = [];

    for (const field of fields) {
      const { key, value, flagVisibility } = field;

      // Construct a new document with the field data
      const newDocument = new Field({
        type:{[key]: value}, // Set the dynamic data based on user input
        flagVisibility
      });
      console.log(newDocument)
      // Save the document to the database
      const savedDocument = await newDocument.save();
      savedDocuments.push(savedDocument);
    }

    res.status(200).json(savedDocuments);
  } catch (error) {
    console.error('Error adding field:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  