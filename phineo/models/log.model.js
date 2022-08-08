const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const logSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    page_name: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Course',
      required: false,
    },
    moduleId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Module',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
logSchema.plugin(toJSON);

/**
 * @typedef Log
 */
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
