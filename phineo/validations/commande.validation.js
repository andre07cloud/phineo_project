const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCommande = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    userId: Joi.string().required().custom(objectId),
    fullname: Joi.string().required(),
    cpf: Joi.string().required(),
    file: Joi.string(),
    offre: Joi.string().required(),
    offre_name: Joi.string().required(),
    offre_description: Joi.string().required(),
    offre_price: Joi.number().required(),
    temps: Joi.string().required(),
  }),
};

const updateCommande = {
  params: Joi.object().keys({
    commandeId: Joi.required().custom(objectId),
  }),
  commandeBody: Joi.object()
    .keys({
      orderEmrysId: Joi.string(),
    })
    .min(1),
};

module.exports = {
  createCommande,
  updateCommande,
};
