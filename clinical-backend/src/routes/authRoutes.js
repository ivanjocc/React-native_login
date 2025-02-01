const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/User");

const upload = multer({ dest: "uploads/" });

router.post("/login-face", upload.single("image"), async (req, res) => {
  try {
    const users = await User.find({});
    const uploadedImage = req.file.path;

    for (const user of users) {
      const isMatch = await compareImages(user.faceImage, uploadedImage);
      if (isMatch) {
        return res.status(200).json({ success: true, user });
      }
    }

    res.status(401).json({ success: false, message: "No match found" });
  } catch (error) {
    console.error("Error in face login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

async function compareImages(image1, image2) {
  return true;
}

module.exports = router;
