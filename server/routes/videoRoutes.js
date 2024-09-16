const express = require('express');
const { uploadVideo, updateVideo, getAllVideos, deleteVideo } = require('../controllers/videoController');
const multer = require('multer');
const router = express.Router();

// Multer config to store video in 'uploads' temporarily
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/video', upload.single('video'), uploadVideo);  // Upload video
router.put('/video/:id', upload.single('video'), updateVideo);  // Update video
router.get('/video', getAllVideos);  // Get all videos
router.delete('/video/:id', deleteVideo);  // Delete video

module.exports = router;
