const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const commandeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    uidEmrys: {
      type: Number,
      required: false,
    },
    fullname: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    offre: {
      type: String,
      required: true,
    },
    offre_name: {
      type: String,
      required: true,
    },
    offre_description: {
      type: String,
      required: true,
    },
    offre_price: {
      type: Number,
      required: true,
    },
    temps: {
      type: String,
      required: true,
      default: '',
    },
    status: {
      type: String,
      required: true,
      default: '',
    },
    file: {
      type: String,
    },
    orderEmrysId: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
commandeSchema.plugin(toJSON);

/**
 * @typedef Commande
 */
const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;
