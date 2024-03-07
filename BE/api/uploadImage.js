// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true, 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
};

async function returnImageUrl(imagePath) {

    // Upload the image
    const publicId = await uploadImage(imagePath);


    const url = cloudinary.url(publicId)
    // Log the image tag to the console
    console.log(url);

};

module.exports({returnImageUrl})

