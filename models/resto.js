const mongoose = require("mongoose");

const restoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: false,
    },
    isOpen: {
        type: Boolean,
        default: false, // Set the default status to closed
    },
});

const Resto = mongoose.model("Restaurant", restoSchema);
module.exports = { Resto, restoSchema };
