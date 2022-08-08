const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const emrysTokenSchema = mongoose.Schema(
  {
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    },
    expires_in: {
      type: Number,
      required: true,
    },
    token_type: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    type: {
      type: String,
    },
    createdAtUnix: {
      type: String,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
emrysTokenSchema.plugin(toJSON);

/**
 * @typedef EmrysToken
 */
const EmrysToken = mongoose.model('EmrysToken', emrysTokenSchema);

module.exports = EmrysToken;
