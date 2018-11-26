const mongoose = require('mongoose');  

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    total_quantity_completed: Number,
    total_quantity_pending: Number,
    total_quantity_expected: Number,
    current_status: String
}, {collection: "orders"});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order

