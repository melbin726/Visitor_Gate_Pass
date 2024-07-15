// ../models/visitor_groups.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for group members within visitor_groups collection
const GroupMemberSchema = new Schema({
  card_id: Number,
  check_in_time: Date,
  check_out_time: Date
});

// Define schema for visitor_groups collection
const VisitorGroupSchema = new Schema({
  _id: Schema.Types.ObjectId, // Automatically generated ObjectId
  session_id: { type: Schema.Types.ObjectId, ref: 'visitor_sessions' }, // Reference to VisitorSession collection
  group_members: [GroupMemberSchema]
});

// Create and export the model based on the schema
const VisitorGroup = mongoose.model('visitor_groups', VisitorGroupSchema);

module.exports = VisitorGroup;