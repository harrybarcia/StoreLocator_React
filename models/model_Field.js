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

const DynamicModel = mongoose.model('Field', dynamicSchema);

module.exports = DynamicModel;
