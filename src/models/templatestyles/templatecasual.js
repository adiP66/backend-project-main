const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },


  price:{
    type: Number,
    default: 0
  }
  ,
});

const Templatecasual = mongoose.model('Templatecasual', templateSchema);

module.exports = Templatecasual;

