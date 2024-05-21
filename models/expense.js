const {mongoose} = require('../connection/connect');

const ExpenseSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true
    },
    expenseAmount: {
        type: Number,
        required: true
    },
    expenseCategory: {
        type: String,
        required: true
    },
    expenseDescription: {
        type: String,
        required: true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        required : true
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

const Expense = mongoose.model('expense', ExpenseSchema);

module.exports = Expense;
