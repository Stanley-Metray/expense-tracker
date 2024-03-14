const Razorpay = require('razorpay');
const Order = require('../models/order');

module.exports.makePayment = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZOR_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    // const razorpay = new Razorpay({
    //     key_id: "rzp_test_FIFPO5GC78zjhW",
    //     key_secret: "pglM25JC1v0htFUGjMvdvipT"
    // });
    const options = {
        amount: 5000,
        currency: 'INR',
        receipt: `receipt_order_74394`
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
}

module.exports.upgardeUser = async (req, res) => {
    try {
        await Order.create(req.body);
        res.status(201).send(true);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
}

module.exports.premiumStatus = async (req, res) => {
    try {
        const order = await Order.findOne({ where: { UserId: req.body.UserId } });
        
        if (order && order.premium)
            res.status(200).send({ premium: true });
        else
            res.status(200).send({ premium: false });
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
}