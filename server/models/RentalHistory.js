const mongoose = require('mongoose');

const RentalHistorySchema = new mongoose.Schema({
  customerId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',},
  ebikelistingId: {type: mongoose.Schema.Types.ObjectId,ref: 'Ebike',},
  category:{ type: String, required: true },
  model: { type: String, required: true },
  rentalDate: { type: String, required: true },
  duration: { type: String, required: true },
},
{timestamps: true}
);

const RentalHistory = mongoose.model('RentalHistory', RentalHistorySchema);
module.exports = RentalHistory