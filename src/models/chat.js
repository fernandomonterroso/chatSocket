'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatSchema = Schema({
    mensaje: String,
    date: { type: Date, default: Date.now },
    ip: String,
    usuarioOrigen: {type: Schema.ObjectId, ref:'Usuario'},
    usuarioDestinatario: {type: Schema.ObjectId, ref:'Usuario'},
});

module.exports = mongoose.model('Chat', chatSchema);