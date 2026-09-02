const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { isAuthenticated, isSupportStaff } = require('../middleware/auth');
const mongoosePaginate = require('mongoose-paginate-v2');
const User = require("../models/User");

// Assuming isAuthenticated and isSupportStaff are middleware that you have implemented
// in the auth.js file which validates the user and checks if they are support staff.

// Create a new support ticket
router.post('/:userId/createticket', async (req, res) => {
  try {
    const { userId } = req.params
    const { subject, description } = req.body;
    const customerId = userId; 
    
    const newTicket = new SupportTicket({
      customerId,
      subject,
      description,
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to create support ticket", error: error.message });
  }
});


// Get all tickets with pagination
router.get('/tickets', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Create options object for pagination
    const options = {
      page: parseInt(page, 20),
      limit: parseInt(limit, 3),
      populate: 'customerId', // Populate customerId field with user details
    };

    // Use mongoose-paginate-v2 plugin to paginate the results
    const result = await SupportTicket.paginate({}, options);

    // Check if there are no tickets found
    if (result.docs.length === 0) {
      return res.status(404).json({ message: 'No tickets found' });
    }

    // Send paginated tickets as response
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tickets', error: error.message });
  }
});



// Get all tickets for a specific user with pagination
router.get('/:userId/tickets', async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    // Create options object for pagination
    const options = {
      page: parseInt(page, 20),
      limit: parseInt(limit, 3),
      populate: 'customerId', // Populate customerId field with user details
    };

    // Use mongoose-paginate-v2 plugin to paginate the results
    const result = await SupportTicket.paginate({ customerId: userId }, options);

    // Check if there are no tickets found
    if (result.docs.length === 0) {
      return res.status(404).json({ message: 'No tickets found' });
    }
  
    // Send paginated tickets as response
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tickets', error: error.message });
  }
});



// Get a specific ticket
router.get('/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve ticket", error: error.message });
  }
});

// Reply to a support ticket
router.post('/tickets/:ticketId/responses', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const {userId, response } = req.body;
    const supportStaffId = userId;

 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const supportAgent = user.firstName + " " + user.lastName;
    const status = "pending";

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update the status
    ticket.status = status;

    ticket.responses.push({
      supportStaffId,
      response,
      supportAgent,
      
    });

    await ticket.save();
    res.status(200).json({ message: "Response added to support ticket", ticket });
  } catch (error) {
    res.status(500).json({ message: "Failed to respond to support ticket", error: error.message });
  }
});


// Close a support ticket
router.patch('/tickets/:ticketId/close', async (req, res) => {
  try {
    const { ticketId } = req.params;
    // Find the ticket by ID and update its status to 'resolved'
    const ticket = await SupportTicket.findByIdAndUpdate(ticketId, { status: 'resolved' }, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket closed successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Failed to close ticket", error: error.message });
  }
});



module.exports = router;
