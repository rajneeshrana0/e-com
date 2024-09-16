const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  public_id: { type: String, required: true }  // Store public_id to manage Cloudinary video
});

module.exports = mongoose.model('Video', videoSchema);
