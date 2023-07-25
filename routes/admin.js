const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");
const { typeIngredient } = require("../models/type_ingredient");
const { Ingredient } = require("../models/Ingredient");
const { TabIngredient } = require("../models/TabIngredient");

const { Category } = require("../models/categorie");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Order = require("../models/order");
const { Resto } = require("../models/resto");
const User = require("../models/user");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const keysecret = process.env.JWT_SECRET;
// Add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
    try {
        const { name, description, images, quantity, price, category } = req.body;
        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//get all products
adminRouter.get("/admin/get-products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//delete the product 
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//update product 
adminRouter.post("/admin/update-product", admin, async (req, res) => {
    try {
        const { id, name, description, images, quantity, price, category } = req.body;

        // Find the product by ID
        let product = await Product.findByIdAndUpdate(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update the product properties
        product.name = name;
        product.description = description;
        product.images = images;
        product.quantity = quantity;
        product.price = price;
        product.category = category;

        // Save the updated product
        product = await product.save();

        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
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
        let category = await Category.findByIdAndUpdate(id, req.body, { new: true });

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

/////////////////////////////////////

adminRouter.route("/api/update/:email").patch(async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const result = await User.findOneAndUpdate({
            email: req.params.email
        },
            { $set: { password: hashedPassword } });

        if (!result) {
            // User not found or password not updated
            return res.status(404).json({ msg: "email not found" });
        }

        const msg = {
            msg: "Password successfully updated",
        };

        // Send an email with the success message only if the user is found
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.params.email,
            subject: "Password Update Notification",
            text: "Your password has been successfully updated.",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        return res.json(msg);
    } catch (err) {
        return res.status(500).json({ msg: err });
    }
});


adminRouter.delete("/admin/delete-user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let user = await User.findByIdAndDelete(id);
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Route pour ajouter un produit à une catégorie
adminRouter.post('/categories/product', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            images: req.body.images,
            price: req.body.price,
            category: req.body.category
        });
        const savedProduct = await product.save();

        const category = await Category.findById(req.body.category);
        if (category && category.products) {
            category.products.push(savedProduct);
        }
        const savedCategory = await category.save();
        console.log(savedCategory)

        res.status(200).json(savedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while adding the product');
    }
});


///// ajouter un ingredient a une categorie 
adminRouter.post('/categories/typeIngredient', async (req, res) => {
    try {
        const type = new typeIngredient({
            name: req.body.name,
            category: req.body.category
        });
        const savedType = await type.save();

        const category = await Category.findById(req.body.category);
        if (category && category.typeIngredient) {
            category.typeIngredient.push(savedType);
        }
        const savedCategory = await category.save();
        console.log(savedCategory)

        res.status(200).json(savedType);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while adding the product');
    }
});


// Route pour récupérer tous les type ingredients d'une catégorie
adminRouter.get('/categories/:categoryId/typeIngredient', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId).populate('typeIngredient').exec();
        res.status(200).json(category.typeIngredient);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la recherche de la catégorie');
    }
});

///// ajouter un ingredient a une categorie 
adminRouter.post('/typeIngredient/ingredient', async (req, res) => {
    try {
        const ingredient = new Ingredient({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            type: req.body.type
        });
        const savedIngredient = await ingredient.save();

        const type = await typeIngredient.findById(req.body.type);
        if (type && type.ingredients) {
            type.ingredients.push(savedIngredient);
        }
        const savedType = await type.save();
        console.log(savedType)

        res.status(200).json(savedIngredient);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while adding the product');
    }
});

// Route pour récupérer tous les produits d'une catégorie
adminRouter.get('/typeIngredient/:typeIngredientId/ingredient', async (req, res) => {
    try {
        const type = await typeIngredient.findById(req.params.typeIngredientId).populate('ingredients').exec();
        res.status(200).json(type.ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la recherche de la type ');
    }
});


// Route pour récupérer tous les produits d'une catégorie
adminRouter.get('/categories/:categoryId/products', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId).populate('products').exec();
        res.status(200).json(category.products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la recherche de la catégorie');
    }
});

adminRouter.delete('/categories/:categoryId/products/:productId', async (req, res) => {
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



adminRouter.put('/categories/:categoryId/products/:productId', async (req, res) => {
    try {
        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.productId, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du produit');
    }
});



adminRouter.get("/admin/get-orders", admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
    try {
        const { id, status } = req.body;
        let order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add information 
adminRouter.post("/admin/add-resto", async (req, res) => {
    try {
        const { name, location, isOpen } = req.body;
        let resto = new Resto({
            name,
            location,
            isOpen

        });
        resto = await resto.save();
        res.json(resto);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


adminRouter.get("/admin/get-resto", async (req, res) => {
    try {
        const restos = await Resto.find({});
        res.json(restos);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//delete the product 
adminRouter.delete("/admin/delete-resto/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let resto = await Resto.findByIdAndDelete(id);
        res.json(resto);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//update resto 
adminRouter.put("/admin/update-resto/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, isOpen } = req.body;

        // Find the product by ID
        let resto = await Resto.findByIdAndUpdate(id);

        if (!resto) {
            return res.status(404).json({ error: "Resto not found" });
        }

        // Update the product properties
        resto.name = name;
        resto.location = location;
        resto.isOpen = isOpen
        // Save the updated product
        resto = await resto.save();

        res.json(resto);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update restaurant status
adminRouter.put("/admin/update-resto-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { isOpen } = req.body;

        // Find the restaurant by ID
        let resto = await Resto.findByIdAndUpdate(id);

        if (!resto) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Update the restaurant status
        resto.isOpen = isOpen;

        // Save the updated restaurant
        resto = await resto.save();

        res.json(resto);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add product to favorite list
adminRouter.post("/admin/add-to-favorites", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        user.favorites.push(product);
        await user.save();

        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// Remove product from favorite list
adminRouter.delete("/admin/remove-from-favorites/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const productIndex = user.favorites.findIndex(
            (favorite) => favorite._id.toString() === productId
        ); if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found in favorites" });
        }

        user.favorites.splice(productIndex, 1);
        await user.save();

        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
adminRouter.get("/admin/get-favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("favorites").exec();
        res.json(user.favorites);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.post('/tabIngredient', async (req, res) => {
    try {
        const Tabingredient = new TabIngredient({
            name: req.body.name,
            id_product: req.body.id_product,
            id_ingredient: req.body.id_ingredient,
            type_ingredient: req.body.type_ingredient
        });
        const savedTabIngredient = await Tabingredient.save();
        res.json(savedTabIngredient);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});
//Get all
adminRouter.get("/getTabIngredient", async (req, res) => {
    try {
        const tabIngredient = await TabIngredient.find({});
        res.json(tabIngredient);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
adminRouter.get("/tabIngredients/:userId/:productId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        // Find the user and product by their respective ids first
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ message: 'User or Product not found' });
        }

        // Find tabIngredients with matching userId and productId
        const tabIngredients = await TabIngredient.find({ userId, productId });

        res.json({ user, product, tabIngredients });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})
// Route to add a new tabIngredient for a specific user and product
adminRouter.post('/tabIngredients', async (req, res) => {
    try {
        console.log(req.body)
        //const { name, userId, productId } = req.body;
        /*
                // Find the user by userId first
                const user = await User.findById(userId);
        
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
        
                // Find the product by productId
                const product = await Product.findById(productId);
        
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }*/

        // Create the new tabIngredient document
        const newTabIngredient = new TabIngredient({
            name: req.body.name,
            userId: req.body.userId,
            productId: req.body.productId,
        });
        /*const newTabIngredient = new TabIngredient({
            name: "Ingredient Name",
            userId: "64ab070308eccfcfe21cd952", // Replace with the actual userId
            productId: "6481b800485429d4a36f1fac" // Replace with the actual productId
        });*/
        console.log("test")
        // Save the new tabIngredient to the database
        const savedTabIngredient = await newTabIngredient.save();

        res.json(savedTabIngredient);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = adminRouter;