const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const responseSchema = mongoose.Schema(
  {
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Course', required: false },
    modulesResponse: {
      type: [
        {
          moduleId: { type: String, required: true },
          response: { type: String, required: false },
          quizResponse: { type: Array, required: false },
          quizScore: { type: String, required: false },
          validated: { type: Boolean, required: true, default: false },
          timeAdded: { type: Number, required: false, default: 0 },
        },
      ],
      default: [],
    },
    timeOnCourse: { type: Number, required: false, default: 0 },
    progress: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
responseSchema.plugin(toJSON);

/**
 * @typedef Response
 */
const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
