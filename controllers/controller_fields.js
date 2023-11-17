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
  console.log("fieldsArray",fieldsArray )
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
    const existingField = await Field.findById(field.id);
    if (existingField) {
      console.log("in existing")
      await Field.findByIdAndUpdate(field.id, field);
      const associatedStores = await Store.find({
        'typeObject.id': field.id,
      });

      for (const store of associatedStores) {
          const updateResult = await Store.updateMany(
            { 'typeObject.id': field.id },
            { $set: { 'typeObject.$[].visibility': field.visibility } }
          );
        await store.save();
      }
    }
    else {
      console.log("creating!", field)
      try {
          const { key, value, visibility, isFilter } = field;
          // Construct a new document with the field data
          const newDocument = new Field({
            type:{[key]: value}, // Set the dynamic data based on user input
            visibility,
            isFilter
          });
          
          // Save the document to the database
          const savedDocument = await newDocument.save();

          // Retrieve all stores
          const allStores = await Store.find();

          const newTypeObjectItem = {
            id: savedDocument._id.toString(),
            key,
            value,
            isFilter,
            visibility,
            data: '', // You might need to set the data property based on your requirements
          };

           for (const store of allStores) {
            // Check if the field is not already present in the store
            console.log("1", newTypeObjectItem.id.toString())
            console.log("2", newTypeObjectItem.id)
            const hasField = store.typeObject.some(obj => obj.id === newTypeObjectItem.id.toString());
            if (!hasField) {
              store.typeObject.push({
                id:savedDocument._id.toString(), 
                key, // Use the actual field properties you want to associate
                value,
                isFilter, 
                visibility, 
                data:''
              });
              await store.save();
              console.log(`Field added to store ${store}`);
            }
          }
        }
          catch (error) {
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
    // Update each store's typeObject to remove objects with the specified fieldId
    for (const store of storesToUpdate) {
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



  