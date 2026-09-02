const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const authRoutes = require("./routes/auth.js")
const ebikeListingRoutes = require("./routes/ebikes.js")
const rentalRoutes = require("./routes/rental.js")
const userRoutes = require("./routes/user.js")
const paymentRoutes = require('./routes/payment');
const supportRoutes = require('./routes/support.js');
const reviewRoutes = require('./routes/review.js');



/* ROUTES */
app.use("/auth", authRoutes)
app.use("/ebikes", ebikeListingRoutes)
app.use("/rentals", rentalRoutes)
app.use("/users", userRoutes)
app.use('/payment', paymentRoutes);
app.use('/support', supportRoutes);
app.use('/reviews', reviewRoutes);



/* MONGOOSE SETUP */
const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "E_Bike",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));