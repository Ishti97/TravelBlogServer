const multer = require("multer");
const SharpMulter = require("sharp-multer");

const newFilenameFunction = (og_filename, options) => {
  const randomNumber = Math.floor(Math.random() * 1000000); 
  const newname =
    `${options.useTimestamp ? "-" + Date.now() : ""}` +
    randomNumber +
    ".png";
  return newname;
};

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "public/postImage"),

  imageOptions: {
    fileFormat: "png",
    quality: 80,
    resize: { width: 500, height: 500, resizeMode: "contain" },
  },
  filename: newFilenameFunction,
});
const upload = multer({ storage });
module.exports = {upload}