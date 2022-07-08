const mongoose = require("mongoose");
const modeloMensajes = require("./models/modeloMensajes");
const norm = require("normalizr");
const util = require("util");

function print(objeto){
    console.log(util.inspect(objeto, false, 12, true));
}

const autorSchema = new norm.schema.Entity('autor');
const mensajeSchema = new norm.schema.Entity('mensaje', {
    autor: autorSchema,
});

class Mensajes{
    constructor(){
    }

    async guardar_mensajes(mensaje){
        const mensajeSaveModel = new modeloMensajes(mensaje);
        console.log(mensajeSaveModel);
        await mensajeSaveModel.save();
    }

    async cargar_mensajes(){
        const mensajes = await modeloMensajes.find({});
        const normalizado = norm.normalize(mensajes, [ mensajeSchema ]);

        return normalizado;
    }
}



module.exports = {mensajes: Mensajes};

