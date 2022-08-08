const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const correctionSchema = mongoose.Schema(
  {
    filePath: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
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
    uploadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
correctionSchema.plugin(toJSON);

/**
 * @typedef Correction
 */
const Correction = mongoose.model('Correction', correctionSchema);

module.exports = Correction;
