// faceRecognition.js
const User = require("../models/User");
const faceApi = require("face-api.js");

const validateFace = async (faceData) => {
  const users = await User.find({});
  for (const user of users) {
    if (faceApi.matchDescriptor(faceData, user.faceData)) {
      return user;
    }
  }
  return null;
};

module.exports = { validateFace };
