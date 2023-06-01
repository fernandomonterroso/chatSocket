'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    nick: String,
    email: String,
    password: String,
    image: String,
});

module.exports = mongoose.model('Usuario', UsuarioSchema);