const router = require("express").Router();
const multer = require("multer");

const Ebikes = require("../models/Ebike");
const User = require("../models/User")
const Rental = require("../models/Rentals");

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    },
  });
  
  const upload = multer({ storage });

/* CREATE EBIKE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
    try {
        /* Take the information from the form */
        const {
          creator,
          category,
          model,
          availability,
          streetAddress,
          aptSuite,
          city,
          province,
          country,
          price,
          batteryLife,
          weight,
        } = req.body;
        const listingPhotos = req.files

        if (!listingPhotos) {
        return res.status(400).send("No file uploaded.")
        }

        const listingPhotoPaths = listingPhotos.map((file) => file.path)

        const newListing = new Ebikes({
            creator,
            category,
            model,
            availability,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            price,
            batteryLife,
            weight,
            listingPhotoPaths,
        })

        await newListing.save()

        res.status(200).json(newListing)
    } catch (err) {
        res.status(409).json({ message: "Fail to create Listing", error: err.message })
        console.log(err)
    }
});

/* GET EBIKE lISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
    const queryCategory = req.query.category

    try {
        let ebikelistings
        if (queryCategory) {
            ebikelistings = await Ebikes.find({ category: queryCategory }).populate("creator")
        } else {
            ebikelistings = await Ebikes.find().populate("creator")
        }

        res.status(200).json(ebikelistings)
    } catch (err) {
        res.status(404).json({ message: "Fail to fetch listings", error: err.message })
        console.log(err)
    }
})



/* Ebike Details*/
router.get("/:listingId", async (req, res) => {
    try {
      const { listingId } = req.params
      const listing = await Ebikes.findById(listingId).populate("creator")
      res.status(202).json(listing)
    } catch (err) {
      res.status(404).json({ message: "Listing can not found!", error: err.message })
    }
})

/* Update Availability of EBIKE LISTING */
router.patch("/:listingId/update-availability", async (req, res) => {
  try {
      const { listingId } = req.params;
      const { availability } = req.body;
      
      // Validate the incoming availability status
      if (!["yes", "no"].includes(availability)) {
          return res.status(400).json({ message: "Invalid availability status." });
      }

      // Find the e-bike listing by ID and update the availability
      const updatedListing = await Ebikes.findByIdAndUpdate(
          listingId,
          { availability },
          { new: true }
      );

      if (!updatedListing) {
          return res.status(404).json({ message: "E-bike listing not found." });
      }
      
     
      console.log(listingId);
      res.status(200).json(updatedListing);


  } catch (err) {
      res.status(500).json({ message: "Error updating availability.", error: err.message });
  }
});


module.exports = router