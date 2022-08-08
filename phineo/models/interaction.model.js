const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const interactionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    teacher: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    users: [{
      user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
      assignmentDate: { type: Date, default: Date.now }
    }],
    interactions: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'InteractionMessage' }],
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
interactionSchema.plugin(toJSON);

/**
 * @typedef InteractionModule
 */
const InteractionModule = mongoose.model('Interaction', interactionSchema);

module.exports = InteractionModule;