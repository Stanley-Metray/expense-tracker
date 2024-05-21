const {mongoose} = require('../connection/connect');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const ForgotPasswordRequests = mongoose.model('ForgotPasswordRequests', ForgotPasswordRequestSchema);

module.exports = ForgotPasswordRequests;
