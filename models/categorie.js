const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: false,
            default: [],
        },
    ],
    products: [{
        type: mongoose.Schema.ObjectId, // Utilisation d'une référence à l'ID du product
        ref: 'Product', // Référence au modèle product
    }],
    typeIngredient: [{
        type: mongoose.Schema.ObjectId, // Utilisation d'une référence à l'ID du product
        ref: 'typeIngredient', // Référence au modèle product
    }],
});

const Category = mongoose.model('Category', categorySchema);
module.exports = { Category, categorySchema };