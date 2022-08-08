const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const interactionMessageSchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Course',
      required: false,
    },
    daysAfter: {
      type: Number,
      default: 2,
      required: true,
    },
    hourOfTheDay: {
      type: Number,
      default: 8,
      required: true,
    },
    minuteOfTheDay: {
      type: Number,
      default: 0,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: {
        nodes: [{ type: Object }],
        edges: [{ type: Object }],
      },
    },
    begin: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
interactionMessageSchema.plugin(toJSON);

/**
 * @typedef InteractionMessageModule
 */
const InteractionMessageModule = mongoose.model('InteractionMessage', interactionMessageSchema);

module.exports = InteractionMessageModule;
