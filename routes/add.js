///////////////
const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");
const { Category } = require("../models/categorie");
const authRouter = require("./auth");


// Route pour ajouter un produit à une catégorie
authRouter.post('/categories/:categoryId/products', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            images: req.body.images,
            price: req.body.price,
            category: req.params.categoryId
        });
        const savedProduct = await product.save();

        const category = await Category.findById(req.params.categoryId);
        if (category && category.products) {
            category.products.push(savedProduct);
        }
        const savedCategory = await category.save();

        res.status(200).json(savedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while adding the product');
    }
});



// Route pour récupérer tous les produits d'une catégorie
// Route pour récupérer tous les produits d'une catégorie
authRouter.get('/categories/:categoryId/products', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId).populate('products').exec();
        res.status(200).json(category.products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la recherche de la catégorie');
    }
});



// Route pour modifier un produit dans une catégorie
authRouter.put('/categories/:categoryId/products/:productId', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du produit');
    }
});



// Route pour supprimer un produit d'une catégorie


authRouter.delete('/categories/:categoryId/products/:productId', async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.productId);
        await Category.findByIdAndUpdate(
            req.params.categoryId,
            { $pull: { products: req.params.productId } }
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression du produit');
    }
});

/////////////////////////////////////////


// Add category
adminRouter.post("/admin/add-category", admin, async (req, res) => {
    try {
        const { name, images } = req.body;
        let category = new Category({
            name,
            images,
        });
        category = await category.save();
        res.json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get all categories
adminRouter.get("/admin/get-categories", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete category
adminRouter.delete("/admin/delete-category/:id", admin, async (req, res) => {
    try {
        const { id } = req.params;
        let category = await Category.findByIdAndDelete(id);
        res.json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update category
adminRouter.put("/admin/update-category/:id", admin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, images } = req.body;

        // Find the category by ID
        let category = await Category.findByIdAndUpdate(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Update the category properties
        category.name = name;
        category.images = images;

        // Save the updated category
        category = await category.save();

        res.json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = adminRouter;