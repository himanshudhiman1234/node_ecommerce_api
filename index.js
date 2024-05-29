const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart")


app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB CONNECTION SUCCESSFUL");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // Ensure this matches your route path
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)



app.get("/api/test", () => {
    console.log("test is successful");
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running");
});
