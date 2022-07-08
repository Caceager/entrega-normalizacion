const mongoose = require('mongoose');

const productCollection = 'productos';

const ProductSchema = new mongoose.Schema({
    id: {type: Number, require: true},
    nombre: {type: String, require: true, max: 100},
    precio: {type: Number, require: true},
    imagen: {type: String, require: true, max: 100},
})

const products = mongoose.model(productCollection, ProductSchema);

module.exports = products;