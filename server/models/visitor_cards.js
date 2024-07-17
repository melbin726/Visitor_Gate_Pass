const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorCardSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  card_id: {
    type: Number,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned'], //'checked_in', 'checked_out'], // Enum to restrict the values for status
    required: true
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: 'visitor_sessions', // Assuming 'Visitor' is the collection for visitors
    required: false // Optional, as it might not be assigned
  }
});

const VisitorCard = mongoose.model('visitor_cards', VisitorCardSchema);

module.exports = VisitorCard;