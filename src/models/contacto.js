'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var contactoSchema = Schema({
    nombre: String,
    apellido: String,
    apodo: String,
    correo: String,
    direccion: String,
    image: String,
    telefono: String,
    usuario: {type: Schema.ObjectId, ref:'Usuario'}
});

module.exports = mongoose.model('Contacto', contactoSchema);