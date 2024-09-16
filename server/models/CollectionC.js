const mongoose = require('mongoose');

// Define ProductCollection schema
const productCollectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
}, { suppressReservedKeysWarning: true }); // Option to suppress warnings if needed

module.exports = mongoose.model('ProductCollection', productCollectionSchema);
