const FieldColor=require('../models/model_FieldColor')
console.log('here');
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 

exports.getFieldsColors = async (req, res, next) => {
    // console.log("here in fields controller")
    const data = await FieldColor.find();
    return res.status(200).json(data)
};




