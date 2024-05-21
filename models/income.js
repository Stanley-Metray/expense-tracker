const {mongoose} = require('../connection/connect');

const IncomeSchema = new mongoose.Schema({
    incomeName: {
        type: String,
        required: true
    },
    incomeAmount: {
        type: Number,
        required: true
    },
    incomeDescription: {
        type: String,
        required: true
    },
    incomeCategory: {
        type: String,
        required: true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },
    createdAt : {
        type : Date,
        default : new Date().toUTCString()
    },
    updatedAt : {
        type : Date,
        default : new Date().toUTCString()
    }
});

const Income = mongoose.model('income', IncomeSchema);

module.exports = Income;
