const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  customerId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',},
  ebikelistingId: {type: mongoose.Schema.Types.ObjectId,ref: 'Ebike',},
  category:{ type: String, required: true },
  model: { type: String, required: true },
  rentalDate: { type: String, required: true },
  rentTime:{ type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
},
{timestamps: true}
);

const Rental = mongoose.model('Rental', RentalSchema);
module.exports = Rental