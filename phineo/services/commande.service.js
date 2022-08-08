const httpStatus = require('http-status');
const axios = require('axios');
const qs = require('qs');
const { Commande } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const getCommandeById = async (id) => {
  const commande = await Commande.findById(id);
  return commande;
};

const createCommandeEmrys = async (commandeBody, userBody, emrysOrder) => {
  const commande = {
    email: commandeBody.email,
    userId: userBody._id,
    uidEmrys: emrysOrder.uid,
    fullname: commandeBody.fullname,
    cpf: commandeBody.cpf,
    file: commandeBody.file,
    offre: commandeBody.offre,
    offre_name: commandeBody.offre_name,
    offre_description: commandeBody.offre_description,
    offre_price: commandeBody.offre_price,
    temps: commandeBody.temps,
    status: emrysOrder.status,
    orderEmrysId: emrysOrder.id,
  };

  return Commande.create(commande);
};

const createOrderEmrys = async (commandeBody, userBody, tokenEmrys) => {
  const nbCommande = await Commande.countDocuments({});

  const orderEmrys = await axios({
    method: 'post',
    url: `https://api.emryslacarte.fr/api/external-order/create`,
    data: {
      client_id: config.emrys.client,
      client_secret: config.emrys.secret,
      merchantOrderIdentifier: `LaFormationEnchantee #${nbCommande + 1}`,
      uid: parseInt(userBody.uid, 10),
      items: [
        {
          name: commandeBody.offre_name,
          description: commandeBody.offre_description,
          quantity: 1,
          unitPrice: commandeBody.offre_price,
          totalPrice: commandeBody.offre_price,
        },
      ],
    },
    headers: {
      Authorization: `Bearer ${tokenEmrys.access_token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log('ERRR : ', err);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error ... Try Again Late : ');
    });

  return orderEmrys;
};

const createCommande = async (commandeBody, userBody) => {
  const commande = {
    email: commandeBody.email,
    userId: userBody._id,
    fullname: commandeBody.fullname,
    cpf: commandeBody.cpf,
    file: commandeBody.file,
    offre: commandeBody.offre,
    offre_name: commandeBody.offre_name,
    offre_description: commandeBody.offre_description,
    offre_price: commandeBody.offre_price,
    temps: commandeBody.temps,
    status: 'created',
  };

  return Commande.create(commande);
};

const updateOrderEmrys = async (commandeBody, tokenEmrys, status) => {
  const updateOrder = await axios({
    method: 'patch',
    url: `https://api.emryslacarte.fr/api/external-order/${commandeBody.orderEmrysId}/status`,
    data: {
      client_id: config.emrys.client,
      client_secret: config.emrys.secret,
      status,
    },
    headers: {
      Authorization: `Bearer ${tokenEmrys.access_token}`,
      'Content-Type': 'application/merge-patch+json',
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error ... Try Again Late');
    });

  return updateOrder;
};

const updateCommandeEmrys = async (commandeBody, orderEmrysUpdated) => {
  const currentCommande = await getCommandeById(commandeBody.id);
  Object.assign(currentCommande, orderEmrysUpdated);
  await currentCommande.save();
  return currentCommande;
};

const updateCommande = async (commandeBody, newStatus) => {
  const currentCommande = await getCommandeById(commandeBody.id);
  Object.assign(currentCommande, newStatus);
  await currentCommande.save();
  return currentCommande;
};

module.exports = {
  getCommandeById,
  createCommande,
  createOrderEmrys,
  createCommandeEmrys,
  updateOrderEmrys,
  updateCommandeEmrys,
  updateCommande,
};
