// ../models/visitors.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    }
});

const VisitorModel = mongoose.model('visitors', VisitorSchema);

module.exports = VisitorModel;
