const Field=require('../models/model_Field')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 


exports.getFields = async (req, res, next) => {
      console.log("here in fields controller")
      const data = await Field.find();
      return res.status(200).json(data)
  };

exports.addNewField = async (req, res) => {
  // Get the name of the new field and its type.
  const fieldName = req.body.fieldName;
  const type = req.body.type;
  console.log(fieldName,":", type)

  // Add the new field to the schema.
  await Field.addDynamicFieldToSchema(fieldName, type);

  // Send a success response.
  res.sendStatus(200, Field);
};


  