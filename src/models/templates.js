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
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;