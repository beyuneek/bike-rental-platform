const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customerId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',},
  category:{ type: String, required: true },
  model: { type: String, required: true },
  review:{ type: String, required: true },
  reviewer:{ type: String, required: true },

},
{timestamps: true}
);

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review