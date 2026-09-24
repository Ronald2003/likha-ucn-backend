
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'likha_uploads',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp']
    }
  });
  console.log("Using Cloudinary for image uploads");
} else {
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }
  storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, 'img-' + Date.now() + path.extname(file.originalname));
    }
  });
  console.log("Using local disk for image uploads");
}

const upload = multer({ storage });

module.exports = upload;
