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
    roles: {
        type: [String],
        default: ['user'], // Assign a default role, e.g., "user"
      },
    
});                                 

module.exports = mongoose.model('User', usersSchema);
