// ../models/visitor_groups.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for group members within visitor_groups collection
const GroupMemberSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true // Automatically generate ObjectId
  },
  card_id: {
    type: String,
    required: true
  },
  check_in_time: {
    type: Date,
    required: true
  },
  exit_gate: {
    type: String,
    required: false
  },
  check_out_time: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ['checked_in', 'checked_out'],
    required: true
  }
});

// Define schema for visitor_groups collection
const VisitorGroupSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true // Automatically generate ObjectId
  },
  session_id: {
    type: Schema.Types.ObjectId,
    ref: 'visitor_sessions',
    required: true // Assuming session_id is required
  },
  group_members: {
    type: [GroupMemberSchema],
    required: true // Assuming there must be at least one group member
  }
});

// Create and export the model based on the schema
const VisitorGroup = mongoose.model('visitor_groups', VisitorGroupSchema);

module.exports = VisitorGroup;
