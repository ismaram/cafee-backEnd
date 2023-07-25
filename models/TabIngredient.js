const mongoose = require("mongoose");

const TabingredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },


});

const TabIngredient = mongoose.model("TabIngredient", TabingredientSchema);
module.exports = { TabIngredient, TabingredientSchema };