const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    faceImage: String, // Si se necesita almacenar imágenes
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
