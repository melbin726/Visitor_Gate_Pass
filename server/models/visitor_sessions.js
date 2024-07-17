// ../models/visitor_sessions.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorSessionSchema = new Schema({
    visitor_id: { type: Schema.Types.ObjectId, ref: 'visitor' },
    purpose_of_visit: String,
    entry_gate: String,
    check_in_time: Date,
    exit_gate: String,
    check_out_time: Date,
    group_size: Number,
    group_id: { type: Schema.Types.ObjectId, ref: 'visitor_groups' },
    photos: String // Array of base64 encoded images
});

const VisitorSessionModel = mongoose.model('visitor_sessions', VisitorSessionSchema);

module.exports = VisitorSessionModel;
