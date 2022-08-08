const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const tagSchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Course',
      required: true,
    },
    tagName: {
      type: String,
      required: true,
    },
    tagType: {
      type: String,
      required: true,
      default: 'classic',
    },
    tagValue: {
      type: String,
      required: true,
      default: '0',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tagSchema.plugin(toJSON);

/**
 * @typedef Tag
 */
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
