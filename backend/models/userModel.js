const mongoose = require('mongoose')
// const listSchema = require('./listModel.js')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a username'],
    },
    email: {
      type: String,
      required: [true, 'Please add a email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    }
    // watchlists: [listSchema],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)