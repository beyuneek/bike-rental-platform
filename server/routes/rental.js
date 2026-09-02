const router = require("express").Router();
const multer = require("multer");

const Ebikes = require("../models/Ebike");
const Rental = require("../models/Rentals");
const RentalHistory = require("../models/RentalHistory");
const User = require("../models/User");



/*Create Rental*/

router.post("/create", async (req, res) => {
    try {
        const {customerId,ebikelistingId,category,model,rentalDate,rentTime,duration,price} = req.body
        const newRental = new Rental({customerId,ebikelistingId,category,model,rentalDate,rentTime,duration,price})
        await newRental.save()
        res.status(200).json(newRental)
    }catch(err){
        console.log(err)
        res.status(400).json({ message: "Fail to create new rental.", error: err.message})
    }
});



// DELETE route for deleting an e-bike
router.delete("/:ebikelistingId", async (req, res) => {
    const { ebikelistingId } = req.params;
  
    try {
      // Find the e-bike by ID
      const rental = await Rental.findOne({ ebikelistingId: ebikelistingId });
      console.log(rental)
      if (!rental) {
        return res.status(404).json({ message: "E-bike not found." });
      }
  

      // Delete the rental
      await Rental.deleteOne({ ebikelistingId: ebikelistingId });

      // Update the availability of the associated ebike listing
      //await Ebikes.findByIdAndUpdate(ebikelistingId, { availability: "yes" });
  
      res.status(200).json({ message: "E-bike deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error." });
    }
  });




  // Create RentalHistory
router.post("/:userId/createrentalhistory/:ebikelistingId", async (req, res) => {
  try {
      
      const { userId, ebikelistingId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { _id } = user;

      // Find the e-bike by ID
      const rental = await Rental.findOne({ ebikelistingId: ebikelistingId });
      if (!rental) {
        return res.status(404).json({ message: "E-bike not found." });
      }
      
      const { category, model, rentalDate, duration } = rental;

      // Set customerId to creator id
      const customerId = _id;

      // Create a new rental history entry
      const newRentalHistory = new RentalHistory({ 
          customerId,
          ebikelistingId, 
          category, 
          model, 
          rentalDate, 
          duration 
      });
      await newRentalHistory.save();

      res.status(200).json({  newRentalHistory });
  } catch(err) {
      console.log(err);
      res.status(400).json({ message: "Fail to create new rental history.", error: err.message });
  }
});


/* GET User Rental History LIST */
router.get("/:userId/rentalhistory", async (req, res) => {
  try {
    const { userId } = req.params
    const rentalhistory = await RentalHistory.find({ customerId: userId }).populate("customerId category model rentalDate duration")
    res.status(202).json(rentalhistory)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find trips!", error: err.message })
  }
});


module.exports = router