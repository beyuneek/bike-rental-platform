const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Your route for creating a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Make sure amount is in cents and is an integer

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // or the currency you require
      // Add additional options here if necessary
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router; // Make sure to export the router
