const mongoose = require('mongoose');

const fieldfilterSchema = new mongoose.Schema(
    {
        name: {
            type: String, // Mixed type can represent various data types
            required:true
        },
        color:{
            type:String, 
            default:"#000000", 
            required:true
        }
    }
);

module.exports = mongoose.model('colors', fieldfilterSchema);
