const express = require("express");
const { createUser, getUsers, loginUser } = require("../controllers/userController");
const router = express.Router();
const upload = require('../config/multer');

// Rutas de usuario
router.post("/", createUser);
router.get("/", getUsers);
router.post("/login", loginUser);

router.post('/', upload.single('faceImage'), createUser);


module.exports = router;
