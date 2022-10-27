const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const usersSchema = new Schema({
 
    email: {                                                                            
        type: String,
        required: true
    },    
    password: {
        type: String,
        required: true
    },
    favorites: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Store' }],
    resetToken: String,
    resetTokenExpiration: Date
});                                 

usersSchema.methods.addFavorite = function(storeId) {
    const updatedFavorites = [...this.favorites];
    updatedFavorites.push(storeId);
    this.favorites = updatedFavorites;
    return this.save();
  }
module.exports = mongoose.model('User', usersSchema);
