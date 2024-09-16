const cloudinary = require('../config/cloudinaryConfig');
const Video = require('../models/Video');

// Upload Video Controller
exports.uploadVideo = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_large(req.file.path, { resource_type: 'video', chunk_size: 6000000 });
    const video = new Video({
      videoUrl: result.secure_url,
      public_id: result.public_id  // Store public_id for later deletion
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Video Controller
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete old video from Cloudinary
    await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
    
    // Upload new video
    const result = await cloudinary.uploader.upload_large(req.file.path, { resource_type: 'video', chunk_size: 6000000 });
    video.videoUrl = result.secure_url;
    video.public_id = result.public_id;
    await video.save();
    
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Videos Controller
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Video Controller
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
    
    // Remove video from the database
    await video.remove();
    
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
