let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

const sendNotification = (message) => {
  if (io) {
    io.emit("notification", message);
  } else {
    console.error("Socket.io not initialized");
  }
};

module.exports = { initSocket, sendNotification };
