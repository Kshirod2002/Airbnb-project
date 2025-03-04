const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET, // Corrected to use CLOUD_API_SECRET
});

// Multer storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ['png', 'jpg', 'jpeg'], // Fixed typo in 'allowedFormats'
    },
});

module.exports = {
    cloudinary,
    storage,
};
