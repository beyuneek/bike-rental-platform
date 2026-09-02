const express = require('express');
const router = express.Router();
const Review = require('../models/Reviews');
const User = require("../models/User");

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});


router.get('/:userId', async (req, res) => {
    try {
    const { userId } = req.params
    const review = await Review.find({ customerId: userId }).populate("customerId review")
    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
    } catch (error) {
    res.status(500).json({ message: 'Failed to fetch review', error: error.message });
    }
});

router.post('/createreview', async (req, res) => {
    try {
    const { userId, category, model, review } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviewer = user.firstName + " " + user.lastName;
    const customerId = userId;

    const newReview = new Review({ customerId, category, model, review, reviewer });
    await newReview.save();
    res.status(201).json(newReview);
    } catch (error) {
    res.status(400).json({ message: 'Failed to create review', error: error.message });
    }
});
  
  module.exports = router;
  

module.exports = router;
