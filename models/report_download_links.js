const {mongoose} = require('../connection/connect');

const reportLinksSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const ReportLinks = mongoose.model('ReportLinks', reportLinksSchema);

module.exports = ReportLinks;
