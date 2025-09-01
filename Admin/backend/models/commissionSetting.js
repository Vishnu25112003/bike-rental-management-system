const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  defaultCommission: {
    type: Number,
    required: true,
  },
  tiers: [
    {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('CommissionSetting', CommissionSchema);
