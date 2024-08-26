// ../models/visitor_cards.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorCardSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  card_id: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned'],
    required: true
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: 'visitor_groups.group_members',
    required: false
  },
  last_assigned: [{
    type: Schema.Types.ObjectId,
    ref: 'visitor_groups.group_members',
    required: false
  }]
});

const VisitorCard = mongoose.model('visitor_cards', VisitorCardSchema);

module.exports = VisitorCard;
