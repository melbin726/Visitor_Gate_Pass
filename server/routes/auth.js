// routes/auth.js
const express = require('express');
const upload = require("../middleware/upload");
const router = express.Router();
const UsersModel = require('../models/users.js');
const Visitor = require('../models/visitors.js');
const VisitorSession = require('../models/visitor_sessions.js');
const VisitorGroup = require('../models/visitor_groups.js');
const VisitorCard = require('../models/visitor_cards.js');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    UsersModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.json("No record existed");
            }
            if (password === user.password) {
                req.session.user = {
                    username: user.username,
                    role: user.role
                };
                res.json("Success");
            } else {
                res.json("The password is incorrect");
            }
        })
        .catch(err => {
            console.error('User lookup error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    UsersModel.create({ username, password, role })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json(err));
});

router.get('/visitors', async (req, res) => {
    try {
        // Fetch all necessary data from MongoDB collections
        const visitors = await Visitor.find({});
        const sessions = await VisitorSession.find({});
        const groups = await VisitorGroup.find({});
        const cards = await VisitorCard.find({});

        // Map through sessions to construct the desired response format
        const result = sessions.map(session => {
            // Find corresponding visitor and group information
            const visitor = visitors.find(v => v._id.equals(session.visitor_id));
            const group = groups.find(g => g._id.equals(session.group_id));
            const groupMembers = group ? group.group_members : ['102',130];
            const checkOutTimes = groupMembers.map(member => member.check_out_time);
            let latestCheckOutTime = null;
            if (checkOutTimes.length > 0 && checkOutTimes.every(time => time !== null)) {
                latestCheckOutTime = new Date(Math.max(...checkOutTimes.map(time => new Date(time))));
            }
            // console.log(checkOutTimes);

            // Construct the response object
            return {
                _id: visitor._id,
                name: visitor ? visitor.name : 'Nah',  // Ensure visitor.name is properly fetched
                phone_number: visitor ? visitor.phone_number : 'Nah',  // Ensure visitor.phone_number is properly fetched
                purpose_of_visit: session.purpose_of_visit,
                entry_gate: session.entry_gate,
                check_in_time: session.check_in_time,
                exit_gate: session.exit_gate,
                check_out_time: latestCheckOutTime,
                group_size: session.group_size,
                photos: session.photos,
                visitor_cards: groupMembers ? groupMembers : [{ card_id: 404, status: "checked_out" },{ card_id: 500, status: "checked_in" }],
            };
        });

        // Send the constructed response as JSON
        res.json(result);
    } catch (err) {
        // Handle any errors and send an error response
        console.error('Error fetching visitors:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

