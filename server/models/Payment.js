const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
  amount:{ type: String, required: true },
  date: { type: String, required: true },
},
{timestamps: true}
);

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment