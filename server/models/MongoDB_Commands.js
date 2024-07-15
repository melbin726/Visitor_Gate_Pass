use('visitor_management');

db.visitors.insertOne({
    "_id": ObjectId(), // Automatically generated ObjectId
    "name": "John Doe",
    "phone_number": "1234567890"
});

// Assuming visitor_id and group_id are valid ObjectId references from other collections
db.visitor_sessions.insertOne({
    "_id": ObjectId(), // Automatically generated ObjectId
    "visitor_id": ObjectId("6694f99aec7c5f8639b104b5"), // Replace with valid visitor ObjectId
    "purpose_of_visit": "Campus Tour",
    "entry_gate": "Gate 1",
    "check_in_time": ISODate("2024-06-26T09:00:00Z"),
    "exit_gate": "Gate 1",
    "check_out_time": ISODate("2024-06-26T17:00:00Z"),
    "group_size": 4,
    "group_id": ObjectId() // Replace with valid group ObjectId
});

// Assuming session_id is a valid ObjectId reference from visitor_sessions collection
db.visitor_groups.insertOne({
    "_id": ObjectId(), // Automatically generated ObjectId
    "session_id": ObjectId("6694f9e6ced27f6aa1a06198"), // Replace with valid session ObjectId
    "group_members": [
      {
        "card_id": 101,
        "check_in_time": ISODate("2024-06-26T09:00:00Z"),
        "check_out_time": ISODate("2024-06-26T16:00:00Z")
      },
      {
        "card_id": 102,
        "check_in_time": ISODate("2024-06-26T09:00:00Z"),
        "check_out_time": ISODate("2024-06-26T16:30:00Z")
      }
      // Add more group members if needed
    ]
});  