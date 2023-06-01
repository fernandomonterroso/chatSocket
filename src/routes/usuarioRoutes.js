'use strict'

var express = require("express");
var UserController = require("../controllers/usuarioController");
 var ChatController = require("../controllers/chatController");
var md_auth = require('../middleware/aunthenticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/users'})

var api = express.Router();
api.post('/registrar' ,UserController.registrar)
api.post('/login', UserController.login);
api.post('/subir-imagen-usuario/:id', [md_auth.ensureAuth, md_subir] ,UserController.subirImagen);
api.get('/obtener-imagen-usuario/:imageFile', UserController.getImageFile);
api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario);

api.get('/chat/listarMensajes',md_auth.ensureAuth, ChatController.listarMensajes);
api.post('/chat/postMensaje',[md_auth.ensureAuth], ChatController.postMensaje);
api.get('/chat/listarUltimoMensaje',[md_auth.ensureAuth], ChatController.listarUltimoMensaje);
api.post('/chat/listarMesajeConPersona',[md_auth.ensureAuth], ChatController.listarMesajeConPersona);
module.exports = api;   