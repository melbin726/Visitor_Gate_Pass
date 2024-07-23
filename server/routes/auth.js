// routes/auth.js
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const UsersModel = require('../models/users.js');
const Visitor = require('../models/visitors.js');
const VisitorSession = require('../models/visitor_sessions.js');
const VisitorGroup = require('../models/visitor_groups.js');
const VisitorCard = require('../models/visitor_cards.js');
const VisitorModel = require('../models/visitors.js');

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
                visitor_cards: groupMembers ? groupMembers : [{ card_id: '404', status: "checked_out" },{ card_id: '500', status: "checked_in" }],
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

router.get('/phoneNumber', async (req, res) => {
    const { phone_number } = req.query; // Use req.query for GET parameters

    try {
        const visitor = await VisitorModel.findOne({ phone_number: phone_number });

        if (visitor) {
            // visitor found
            const { name } = visitor; // Assuming you want to return the name
            res.json(name || ""); // Return the name or an empty string if name is falsy
        } else {
            // visitor not found
            res.json(""); // Return an empty string if no visitor found
        }
    } catch (err) {
        console.error('Visitor lookup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// New route to handle purpose filtering
router.get('/purpose', async (req, res) => {
    try {
        const query = req.query.query || '';
        const regex = new RegExp(query, 'i'); // Case-insensitive regex for matching purposes
        const sessions = await VisitorSession.find({ purpose_of_visit: regex }).distinct('purpose_of_visit');
        res.json(sessions);
    } catch (err) {
        console.error('Error fetching purposes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/available_id_cards', async (req, res) => {
    try {
        const query = req.query.query || '';
        const regex = new RegExp(query, 'i'); // Case-insensitive regex for matching purposes

        // Find visitor cards where card_id matches the regex and status is 'available'
        const cards = await VisitorCard.find({ card_id: { $regex: regex }, status: 'available' }).distinct('card_id');

        res.json(cards); // Return the array of matching card_id values
    } catch (err) {
        console.error('Error fetching card IDs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register_Visitor', (req, res) => {
    try{
        const visitorInput = req.data;
        res.json('');
    }catch (err) {
        console.log('Error in registering visitor session', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/checkIDAvailable', async (req, res) => {
    try {
      const { ID_Array } = req.query;
      const ids = Array.isArray(ID_Array) ? ID_Array : [ID_Array];
  
      const cards = await VisitorCard.find({ card_id: { $in: ids } });
  
      const unavailableIds = [];
      cards.forEach(card => {
        if (card.status !== 'available') {
          unavailableIds.push(card.card_id);
        }
      });
  
      if (unavailableIds.length > 0) {
        res.json({ checking: false, msg: `IDs ${unavailableIds.join(', ')} are not available` });
      } else {
        res.json({ checking: true });
      }
    } catch (err) {
      console.log('Error in checking selected IDs', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/checkVisitorAccessibility', async (req, res) => {
    try {
      const { phone_number } = req.query;
  
      // Find the visitor by phone number
      const visitor = await VisitorModel.findOne({ phone_number });
      if (!visitor) {
        return res.json({ checking: false, msg: 'Visitor not found' });
      }
  
      // Check if the visitor has an ongoing session
      const ongoingSession = await VisitorSession.findOne({
        visitor_id: visitor._id,
        check_out_time: null
      });
  
      if (ongoingSession) {
        return res.json({ checking: false, msg: 'Visitor has an ongoing session' });
      } else {
        return res.json({ checking: true });
      }
    } catch (err) {
      console.log('Error in checking visitor accessible', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/register_Checkin_Visitor', async (req, res) => {
    try {
        // Extract VisitorSessionInfo from req.body.params
        const { VisitorSessionInfo } = req.body.params;

        // Log the extracted object
        console.log('Extracted VisitorSessionInfo:', VisitorSessionInfo);

        const {
            PhoneNumber,
            Name,
            PurposeOfVisit,
            EntryGate,
            GroupSize,
            Checkin_time,
            IdCards,
            Photo
        } = VisitorSessionInfo;

        if (!PhoneNumber || !Name || !PurposeOfVisit || !EntryGate || !GroupSize || !Checkin_time || !IdCards) {
            console.log('Missing required fields:', VisitorSessionInfo);
            return res.status(400).json({ checking: false, msg: 'Missing required fields' });
        }

        const checkInDate = new Date(Checkin_time);
        if (isNaN(checkInDate.getTime())) {
            console.log('Invalid Checkin_time format:', Checkin_time);
            return res.status(400).json({ checking: false, msg: 'Invalid Checkin_time format' });
        }

        let ExistingVisitor = true;
        let visitorId = null;

        // Find the visitor by phone number
        const visitor = await VisitorModel.findOne({ phone_number: PhoneNumber });
        if (!visitor) {
            ExistingVisitor = false; // msg: 'Visitor not found'
        } else {
            visitorId = visitor._id;
        }

        // Check if the visitor has an ongoing session
        const ongoingSession = await VisitorSession.findOne({
            visitor_id: visitorId,
            check_out_time: null
        });

        const ids = Array.isArray(IdCards) ? IdCards : [IdCards];
        const cards = await VisitorCard.find({ card_id: { $in: ids } });

        const unavailableIds = [];
        cards.forEach(card => {
            if (card.status !== 'available') {
                unavailableIds.push(card.card_id);
            }
        });

        if (unavailableIds.length > 0) {
            return res.json({ checking: false, msg: `IDs ${unavailableIds.join(', ')} are not available` });
        }

        if (ongoingSession) {
            return res.json({ checking: false, msg: 'Visitor has an ongoing session' });
        }

        if (ExistingVisitor) {
            visitorId = visitor._id;
        } else {
            // Create a new visitor
            const newVisitor = new VisitorModel({
                name: Name,
                phone_number: PhoneNumber
            });

            const savedVisitor = await newVisitor.save();
            visitorId = savedVisitor._id;
        }

        // Create a new document in visitor_sessions
        const newSession = new VisitorSession({
            _id: new mongoose.Types.ObjectId(),
            visitor_id: visitorId,
            purpose_of_visit: PurposeOfVisit,
            entry_gate: EntryGate,
            check_in_time: checkInDate,
            exit_gate: null,
            check_out_time: null,
            group_size: GroupSize,
            group_id: new mongoose.Types.ObjectId(), // Placeholder for group_id
            photos: Photo
        });

        await newSession.save();

        // Create a new document in visitor_groups
        const groupMembers = ids.map(id => ({
            card_id: id,
            check_in_time: checkInDate,
            exit_gate: null,
            check_out_time: null,
            status: 'checked_in'
        }));

        const newGroup = new VisitorGroup({
            _id: new mongoose.Types.ObjectId(),
            session_id: newSession._id,
            group_members: groupMembers
        });

        await newGroup.save();

        // Update the group_id in the session document
        newSession.group_id = newGroup._id;
        await newSession.save();

        // Update visitor_cards with appropriate status and assignments
        await Promise.all(groupMembers.map(async (member, index) => {
            await VisitorCard.updateOne(
                { card_id: member.card_id },
                {
                    $set: {
                        status: 'assigned',
                        assigned_to: newGroup.group_members[index]._id
                    }
                }
            );
        }));

        return res.json({ checking: true, msg: 'Visitor check-in processed successfully' });

    } catch (err) {
        console.error('Error in Register/Checkin Visitor:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router;


