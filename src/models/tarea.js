'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tareaSchema = Schema({
    tarea: String,
    descripcion: String,
    tiempo: String,
    image: String,
    usuario: {type: Schema.ObjectId, ref:'Usuario'}
});

module.exports = mongoose.model('Tarea', tareaSchema);