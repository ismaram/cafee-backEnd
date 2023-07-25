const mongoose = require("mongoose");
const ratingSchema = require("./ratings");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: false,
        },
    ],
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },


    category: {
        type: mongoose.Schema.Types.ObjectId, // Utilisation d'une référence à l'ID de la catégorie
        ref: 'Category', // Référence au modèle Category
    },
    ratings: [ratingSchema],
});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product, productSchema };