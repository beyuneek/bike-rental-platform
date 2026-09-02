const mongoose = require('mongoose');

const ebikeSchema = new mongoose.Schema({
  creator: {type: mongoose.Schema.Types.ObjectId,ref: 'User',},
  category:{ type: String, required: true },
  model: { type: String, required: true },
  availability: { type: String, required: true },
  streetAddress: { type: String, required: true },
  aptSuite: {type: String,required: true,},
  city: {type: String,required: true,},
  province: {type: String,required: true,},
  country: {type: String,required: true,},
  price: { type: Number, required: true },
  batteryLife: { type: String, required: true },
  weight: { type: String, required: true },
  listingPhotoPaths:[{type: String}], // Store photo urls
  // Additional fields as needed
},
{timestamps: true}
);

const Ebike = mongoose.model('Ebike', ebikeSchema);
module.exports = Ebike
