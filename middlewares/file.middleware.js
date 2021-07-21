const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: "",
//   api_key: "",
//   api_secret: "",
// });



const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
});

const VALID_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error("Tipo de archivo inválido. Solo png y jpg");
    return cb(error);
  } else {
    return cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const uploadToCloudinary = async (req, res, next) => {
  if (req.file) {
    try {
      const filePath = req.file.path;

      const image = await cloudinary.uploader.upload(filePath);
      await fs.unlinkSync(filePath);
      console.log("image", image);
      req.fileUrl = image.secure_url;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
};

module.exports = { upload, uploadToCloudinary };
