'use strict'

const mongoose = require("mongoose");
const app = require("./app");
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://127.0.0.1:27017/chatSocket', { useNewUrlParser: true }).then(() => {
mongoose.connect('mongodb+srv://fernando:monterroso10@cluster0.rcswk.mongodb.net/ChatsSocket', { useNewUrlParser: true }).then(() => {
  console.log("La base de datos está corriendo correctamente");

  // Mapa para almacenar las conexiones de los usuarios
  const userConnections = new Map();

  // Configuración de eventos de sockets
  io.on('connection', (socket) => {
    console.log('Un nuevo cliente se ha conectado.');
    


    // Emitir el estado del servidor al cliente que se ha conectado
    socket.emit('server status', true); // Cambia true por la lógica que determine si el servidor está en línea o no

    // Manejo de eventos de chat
    socket.on('chat message', (msg) => {
      console.log('Mensaje recibido:', msg);

      // Obtener el destinatario del mensaje
      const destinatario = msg.usuarioDestinatario;
      const origen = msg.usuarioOrigen;
      // Obtener la conexión del destinatario
      const destinatarioSocket = userConnections.get(destinatario);
      const origenSocket = userConnections.get(origen);

      if (destinatarioSocket) {
        // Enviar el mensaje al destinatario específico
        destinatarioSocket.emit('chat message', msg);
        msg.recibido = true;
        origenSocket.emit('recibio', msg);
      } else {
        console.log(`El destinatario ${destinatario} no está conectado.`);
        msg.recibido = false;
        origenSocket.emit('recibio', msg);
      }
    });

    // Registro de la conexión del usuario
    const userId = socket.handshake.query.userId;
    console.log(userId);
    userConnections.set(userId, socket);

    io.emit('user connected', userId);

    // Desconexión de cliente
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado.');
    
      // Emitir el mensaje de desconexión al resto de los clientes
      io.emit('user disconnected', userId);
    
      // Eliminar la conexión del usuario al desconectarse
      userConnections.delete(userId);
    });
  });

  // Iniciar el servidor
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto: ${port}`);
  });
}).catch(err => console.log(err));
