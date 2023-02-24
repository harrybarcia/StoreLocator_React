const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const PollenSchema=new Schema(
    {storeId:{type: Schema.Types.ObjectId},
        value:{type:Number, required:[true, 'Please add a value']},
        color:{type:String, required:[true, 'Please add a color']},
        forecast:{type:String, required:[true, 'Please add a forecast']},
        province:{type:String, required:[true, 'Please add a province']},
        pro_id:{type:Number, required:[true, 'Please add a pro_id']},
        loc: {
            coordinates: [Number],
            type: { type: String, default: "Point"},
        }
    }
    );
        
module.exports=mongoose.model('Pollen', PollenSchema)