const Field=require('../models/model_Field')
const Store = require('../models/model_Store')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 


exports.getFields = async (req, res, next) => {
      // console.log("here in fields controller")
      const data = await Field.find();
      return res.status(200).json(data)
  };

exports.updateField = async (req, res, next) => {
  const fieldsArray = req.body
  console.log(fieldsArray)
  try {
    for (const field of fieldsArray) {
      console.log(field.id)
      await upsertField(field)
    }
    res.status(200).json({message:"Fields updated successfully"})
  } catch (error) {
    console.error('Error upserting field:', error.message);
  }
}

const upsertField = async (field) => {
  try {
    // I check if it exists
    const existingField = await Field.findById(field.id);
    if (existingField) {
      await Field.findByIdAndUpdate(field.id, field)
      console.log(`Field with id ${field.id} updated.`);
    } else {
      console.log("creating!", field)
      try {
          const { key, value, visibility, isFilter } = field;
          // Construct a new document with the field data
          const newDocument = new Field({
            type:{[key]: value}, // Set the dynamic data based on user input
            visibility,
            isFilter,
            fieldId: field.id, // Set the fieldId property

          });
          console.log(newDocument)
          // Save the document to the database
          const savedDocument = await newDocument.save();
      } catch (error) {
        console.error('Error adding field:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } catch (error) {
    console.error(`Error upserting field with id ${field.id}:`, error.message);
    throw error;
  }
}

exports.deleteField = async (req, res) => {
  const fieldId = req.params.id;
  try {
    // Delete the field item of the collection
    await Field.findByIdAndDelete(fieldId);

    // Delete the fields property of the store
    await Store.updateMany({ fields: fieldId }, { $pull: { fields: fieldId } });
    
    // Delete the typeobject that has the field objectId
    const storesToUpdate = await Store.find({
      typeObject: { $elemMatch: { id: fieldId } },
    });

    // // Find stores with the field in their fields property
    console.log("storesToUpdate", storesToUpdate)
    // Update each store's typeObject to remove objects with the specified fieldId
    for (const store of storesToUpdate) {
      console.log("in the loop", store.id)
      store.typeObject = store.typeObject.filter((obj) => obj.id !== fieldId);
      await store.save();
    }


    // Send a response indicating success
    res.status(200).json({ success: true, message: 'Field deleted' });
  } catch (error) {
    console.error('Error deleting field and updating stores:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



  