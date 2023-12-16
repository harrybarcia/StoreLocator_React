const { ObjectId } = require('mongodb');
const FieldColor=require('../models/model_Color')
exports.getFieldsColors = async (req, res, next) => {
    // console.log("here in fields controller")
    const data = await FieldColor.find();
    return res.status(200).json(data)
};
exports.getFieldsColors = async (req, res, next) => {
    // console.log("here in fields controller")
    const data = await FieldColor.find();
    return res.status(200).json(data)
};

exports.getFieldColors = async (req, res) => {
    const colorId = req.params.id
    const data = await FieldColor.findById(colorId);
    return res.status(200).json(data)
}


exports.addFieldsColors = async (colorsArray, res) => {
    const newColors = []
    try {
      for (let i = 0; i < colorsArray.length; i++) {
        const fieldColor = await upsertColor(colorsArray[i], res);
        newColors.push(fieldColor)
      }
      return newColors
      // If all color updates are successful, send the success response
      
    } catch (error) {
      console.error('Error upserting fieldColor:', error.message);
      // If any error occurs, send an error response
      res.status(500).json('Internal Server Error');
    }
  };
  
const upsertColor = async (colorItem, res) => {
    const { name, color } = colorItem;
    try {
      const fieldColor = new FieldColor({
        name,
        color,
      });
      
      // Save the color sequentially
      await fieldColor.save(); 

      return fieldColor 

      // If the save operation is successful, you can optionally return the result
      // const results = await fieldColor.save();
      // return results;
    } catch (error) {
      console.error('Error saving field color:', error);
      // If an error occurs, throw the error to be caught in the calling function
      throw error;
    }
};
  