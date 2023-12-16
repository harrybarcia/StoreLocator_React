const Field = require('../models/model_Field')
const Store = require('../models/model_Store')
const Color = require('../models/model_Color')
const { addFieldsColors, upsertColor } = require('./controller_color');

exports.getFields = async (req, res, next) => {
      // console.log("here in fields controller")
      const data = await Field.find().sort('order');
      return res.status(200).json(data)
  };

exports.updateField = async (req, res, next) => {
  const fieldsArray = req.body
  try {
    for (const field of fieldsArray) {
      await upsertField(field, res)
    }
  } catch (error) {
    console.error('Error upserting field:', error.message);
  }
}

const upsertField = async (field, res) => {
  try {
    const existingField = await Field.findById(field.id);
    console.log('existingField', existingField);

    const fieldFormatted = Object.assign({}, field, {
      type: {
        [field.key]: field.value
      }
    });
    delete fieldFormatted.key;
    delete fieldFormatted.value;

    console.log('fieldFormatted', fieldFormatted);

    if (existingField) {
      console.log('in existing field');
      // I retrieve the field, remove the data and update with new data
      await Field.findByIdAndUpdate(fieldFormatted.id, fieldFormatted);
      // I retrieve the stores that have typeObject.id with field.id
      const associatedStores = await Store.find({
        'typeObject.id': fieldFormatted.id,
      });
      // console.log("length of associated stores", associatedStores.length)
      // Loop through all the associated stores
      for (const store of associatedStores) {
        // Find the index of the object with the specified id in the typeObject array
        const typeObjectIndex = store.typeObject.findIndex((item) => item.id === fieldFormatted.id);
        // Update the visibility property of the specific object in the typeObject array
        if (typeObjectIndex !== -1) {
          await Store.updateOne(
            { _id: store._id, 'typeObject.id': fieldFormatted.id },
            { 
              $set: { 
                'typeObject.$.visibility': fieldFormatted.visibility,
                'typeObject.$.order': fieldFormatted.order,
                'typeObject.$.isFilter': fieldFormatted.isFilter,
                'typeObject.$.colors': fieldFormatted.colors,

              }
            }
          );
        }
      }
    }
    else {
      try {
        const colorsArray = fieldFormatted.colors;
        console.log('colorsArray', colorsArray);
        const colors = [await addFieldsColors(colorsArray, res)];  // <-- Ensure you await the function call
        console.log('colors', colors);
        const { type, visibility, isFilter, order } = fieldFormatted;
          // Construct a new document with the field data
          const newDocument = new Field({
            type, // Set the dynamic data based on user input
            visibility,
            isFilter,
            order, 
            colors
          });
          
          console.log('newDocument', newDocument.colors);
          // Save the document to the database
          const savedDocument = await newDocument.save();

          // Retrieve all stores
          const allStores = await Store.find();

          const newTypeObjectItem = {
            id: savedDocument._id.toString(),
            type,
            isFilter,
            visibility,
            order,
            colors, // You might need to set the data property based on your requirements
          };

           for (const store of allStores) {
            // Check if the field is not already present in the store
            const hasField = store.typeObject.some(obj => obj.id === newTypeObjectItem.id.toString());
            if (!hasField) {
              store.typeObject.push(newTypeObjectItem);
              await store.save();
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

const createColors = async (colorsData) => {
  try {
    const colorInstances = colorsData.map(color => new Color(color));
    await Color.insertMany(colorInstances);
    return colorInstances.map(color => color._id);
  } catch (error) {
    console.error('Error creating colors:', error);
    throw error;
  }
};

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



  