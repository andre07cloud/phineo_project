const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const sectionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Module' }],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sectionSchema.plugin(toJSON);

/**
 * @typedef Section
 */
const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
