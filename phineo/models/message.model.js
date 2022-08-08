const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const messageSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Course',
      required: true,
    },
    interractionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'InteractionMessage',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    displayDate: {
      type: Date,
      required: true,
    },
    serverDate: {
      type: Date,
      required: true,
    },
    nodeType: {
      type: String,
      required: true,
    },
    nodeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
