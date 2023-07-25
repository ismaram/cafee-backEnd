const express = require("express");
const userRouter = express.Router();
const auth = require('../middlewares/auth');
const { Product } = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

userRouter.post("/api/add-to-cart", auth, async (req, res) => {
    try {
        const { id, quantity, price } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user).populate('cart.product');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.cart.length === 0) {
            user.cart.push({ product, quantity, price });
        } else {
            let isProductfound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.equals(product._id)) {
                    isProductfound = true;
                }
            }
            if (isProductfound) {
                let producttt = user.cart.find((productt) =>
                    productt.product._id.equals(product._id));
                producttt.quantity += quantity;
                producttt.price += price;
            } else {
                user.cart.push({ product, quantity, price });
            }
        }
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);


        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.equals(product._id)) {
                if (user.cart[i].quantity == 1) {
                    user.cart.splice(i, 1)

                }
                else {
                    user.cart[i].quantity -= 1
                }
            }
        }


        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// save user address
userRouter.post("/api/save-user-address", auth, async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// order product
userRouter.post("/api/order", auth, async (req, res) => {
    try {
        const { cart, totalPrice, address } = req.body;
        let products = [];

        for (let i = 0; i < cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);

            products.push({ product, quantity: cart[i].quantity });
            await product.save();

        }

        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save();

        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.get("/api/orders/me", auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



module.exports = userRouter;