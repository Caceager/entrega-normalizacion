const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    id: {type: String, require: true},
    nombre: {type: String, require: true, max: 30},
    apellido: {type: String, require: true, max: 30},
    alias: {type: String, require: true, max: 20},
    imagen: {type: String, require: true, max: 100},
    edad: {type: Number, require: true},
})

const MessageSchema = new mongoose.Schema({
    id: {type: String, require: false},
    autor: {type: AuthorSchema, require:true},
    mensaje: {type: String, require: true, max: 500},
    fecha: {type: String, require: true, max: 30},
})

const messages = mongoose.model("mensajes", MessageSchema);

module.exports = messages;