const mongoose = require('mongoose')

const tickerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    symbol: {
      type: String,
      required: [true, 'Ticker is unavailable'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ticker', tickerSchema)