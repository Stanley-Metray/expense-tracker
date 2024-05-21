const {mongoose} = require('../connection/connect');

const orderSchema = new mongoose.Schema({
    orderId : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'user',
        required : true
    },
    premium: {
        type: Boolean,
        default: false
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
