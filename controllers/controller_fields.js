const Field=require('../models/model_Field')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 


exports.getFields = async (req, res, next) => {
      console.log("here in fields controller")
      const data = await Field.find();
      return res.status(200).json(data)
  };

exports.addFields = async (req, res) => {
  const field1 = req.body.field1
  const field2 = req.body.field2

  const field = await new Field({
    commonField1:field1,
    commonField2:field2
  })
  field.save()
  .then(results=> {
    res.status(200).json({message:"success", data:results})
  })
}

