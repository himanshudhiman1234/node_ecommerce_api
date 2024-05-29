const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.Object, required: true }, // Corrected type
    status: { type: String, default: "pending" }
}, { timestamps: true }); // Corrected 'timestamp' to 'timestamps'

const Order = mongoose.model("Order", OrderSchema); // Changed 'Cart' to 'Order'
module.exports = Order;
