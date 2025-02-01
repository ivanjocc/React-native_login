const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const healthDataRoutes = require("./routes/healthDataRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const { initSocket } = require("./services/socketService");

// Inicialización de la aplicación
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Analiza JSON en las solicitudes

// Conexión a la base de datos
connectDB();

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/health-data", healthDataRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

const multer = require('multer');
const upload = require('./config/multer'); // Importa el middleware de multer

app.post('/api/users', upload.single('faceImage'), async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);

    const { name, email, password } = req.body;

    // Validar datos
    if (!name || !email || !password || !req.file) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Simula guardar el usuario
    const user = {
      name,
      email,
      password,
      faceImage: req.file.path,
    };

    console.log('Usuario guardado:', user);

    res.status(201).json({ success: true, message: 'Usuario creado correctamente', user });
  } catch (error) {
    console.error('Error en el servidor:', error.message || error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Crear un servidor HTTP para socket.io
const server = http.createServer(app);
initSocket(server); // Inicializar sockets

// Configuración del servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
