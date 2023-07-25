const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
        default: 0
    },
    price: {
        type: Number,
        required: false,
    },


    typeIngredient: {
        type: mongoose.Schema.Types.ObjectId, // Utilisation d'une référence à l'ID de la catégorie
        ref: 'typeIngredient', // Référence au modèle Category
    },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
module.exports = { Ingredient, ingredientSchema };