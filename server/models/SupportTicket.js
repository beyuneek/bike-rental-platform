const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const supportTicketSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'pending', 'resolved'],
    default: 'open'
  },
  responses: [{
    supportStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    response: String,
    supportAgent: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

supportTicketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
