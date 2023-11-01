const mongoose=require('mongoose');

const dynamicSchema = new mongoose.Schema(
    {
      // Define common fields that will be present in all documents
      commonField1: String,
      commonField2: Number,
      // ... Add more common fields as needed
  
      // Define a field to store dynamic data
      dynamicData: {
        type: String,
        enum: ['String', 'Number', 'Object', 'Array']
      },
    }
  );

  dynamicSchema.statics.addDynamicFieldToSchema = function (fieldName, type) {
  const newField = {};
  newField[fieldName] = type;

  // Create a new schema with the added field.
  const newSchema = new mongoose.Schema({
    ...this.schema.paths,
    ...newField,
  });

  // Set the new schema on the model.
  this.schema = newSchema;
  dynamicSchema.set(newSchema);

};

const DynamicModel = mongoose.model('Field', dynamicSchema);

module.exports = DynamicModel;
