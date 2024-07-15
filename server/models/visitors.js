// ../models/visitors.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
    name: String,
    phone_number: String
});

const VisitorModel = mongoose.model('visitors', VisitorSchema);

module.exports = VisitorModel;
