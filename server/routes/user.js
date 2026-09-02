const router = require("express").Router()
const multer = require("multer");

const Ebikes = require("../models/Ebike");
const Rental = require("../models/Rentals");
const User = require("../models/User")

/* GET User Rental LIST */
router.get("/:userId/rentals", async (req, res) => {
  try {
    const { userId } = req.params
    const rentals = await Rental.find({ customerId: userId }).populate("customerId ebikelistingId")
    res.status(202).json(rentals)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find trips!", error: err.message })
  }
});


/* GET User Profile */
router.get("/:userId/profile", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/* GET User Profile to edit */
router.get("/:userId/editprofile", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});



// Configuration Multer for File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// Update Profile Route
router.put("/:userId/updateprofile", upload.single("profileImage"), async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Extract updated information from the request body
    const { firstName, lastName, email } = req.body;

    // Update the user's information
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    // Check if a new profile image was uploaded
    if (req.file) {
      user.profileImagePath = req.file.path;
    }

    // Save the updated user object
    await user.save();

    // Send a successful message
    res.status(200).json({ message: "User profile updated successfully!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user profile!", error: err.message });
  }
});




module.exports = router