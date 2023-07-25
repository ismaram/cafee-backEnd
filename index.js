require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const db = "mongodb://127.0.0.1:27017/pfe";


//init 
const PORT = 3000;
const app = express();

//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(userRouter);
app.use(productRouter);







//connections
mongoose
    .connect(db)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });


app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
})