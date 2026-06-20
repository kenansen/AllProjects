const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const todoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, 
  },
  name: {
    type: String,
    required: [true, 'Todo ismi zorunludur'],
  },
  status: {
    type: String,
    enum: ['Backlog', 'In progress', 'Done'], 
    default: 'Backlog',
  },
}, { timestamps: true }); // Ne zaman oluşturulduğu/güncellendiği bilgisini otomatik ekler

module.exports = mongoose.model('Todo', todoSchema);