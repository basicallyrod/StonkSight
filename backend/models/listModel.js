const mongoose = require('mongoose')

const listSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    listName: {
      type: String,
      required: [true, 'Please add a name'],
    },
    tickerList: {
      type: [{type: String}]
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('List', listSchema)