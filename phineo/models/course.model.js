const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    // assignments: [
    //   { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: false }
    // ],
    assignments: {
      type: [
        {
          user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: false },
          beginDate: { type: Date, default: Date.now },
        },
      ],
    },
    sections: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Section' }],
      required: false,
      default: [],
    },
    tags: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Tag' }],
      required: false,
      default: [],
    },
    responses: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Response' }],
      required: false,
      default: [],
    },
    interactions: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'InteractionMessage' }],
    },
    visible: {
      type: Boolean,
      required: true,
      default: true,
    },
    knowledge: {
      type: [
        {
          user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
          message: { type: String, default: '' },
          explain: { type: String, default: '' },
          time: { type: Date, default: Date.now },
        },
      ],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
courseSchema.plugin(toJSON);

/**
 * @typedef Course
 */
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
