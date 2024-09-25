const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configuration
cloudinary.config({ 
  cloud_name: 'ddtjwvj38', 
  api_key: '514678884247695', 
  api_secret: '5YnMUIO0vcMTfVY9P8QJOuXEoA8' // Click 'View API Keys' above to copy your API secret
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };


