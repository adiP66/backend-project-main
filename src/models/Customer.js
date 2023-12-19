const mongoose = require('mongoose');

const Schema = mongoose.Schema;
    
const CustomerSchema = new Schema({
    firstName : {
        type: String,
        required: false
    },
    lastName : {
        type: String,
        required: true 
    },
    details: {
        type: String,
        required: true 
    },
    tel  : {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: false
    },
    createdAt : {
        type: Date, 
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },

         
         
});

module.exports = mongoose.model('Customer', CustomerSchema);