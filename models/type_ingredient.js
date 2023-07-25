const mongoose = require("mongoose");
const typeIngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ingredients: [{
        type: mongoose.Schema.ObjectId, // Utilisation d'une référence à l'ID du product
        ref: 'Ingredient', // Référence au modèle product
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId, // Utilisation d'une référence à l'ID de la catégorie
        ref: 'Category', // Référence au modèle Category
    },
});

const typeIngredient = mongoose.model('typeIngredient', typeIngredientSchema);
module.exports = { typeIngredient, typeIngredientSchema };