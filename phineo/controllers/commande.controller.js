const httpStatus = require('http-status');
const pick = require('../utils/pick');
const { Commande } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commandeService, emrysTokenService, emailService } = require('../services');

const getCommandes = catchAsync(async (req, res) => {
  const commandes = await Commande.find().select('fullname email offre_name cpf status orderEmrysId _id uidEmrys file dev');
  res.send(commandes);
});

const createCommande = catchAsync(async (req, res) => {
  if (!req.user.uid) {
    const commande = await commandeService.createCommande(req.body, req.user);
    await emailService.sendInscriptionCourseEmail(
      req.body.email,
      req.body.fullname,
      req.body.cpf,
      req.body.temps,
      req.body.offre_name,
      req.body.userId
    );
    res.status(httpStatus.CREATED).send(commande);
  } else {
    const userTokenEmrys = await emrysTokenService.checkEmrysUserToken(req.user);
    const tokenEmrys = await emrysTokenService.getEmrysToken();
    const orderEmrys = await commandeService.createOrderEmrys(req.body, req.user, tokenEmrys);
    const commande = await commandeService.createCommandeEmrys(req.body, req.user, orderEmrys);
    await emailService.sendInscriptionCourseEmail(
      req.body.email,
      req.body.fullname,
      req.body.cpf,
      req.body.temps,
      req.body.offre_name,
      req.body.userId
    );
    res.status(httpStatus.CREATED).send(commande);
  }
});

const updateCommande = catchAsync(async (req, res) => {
  if (req.body.commandeBody.uidEmrys) {
    const tokenEmrys = await emrysTokenService.getEmrysToken();
    const updateOrderEmrys = await commandeService.updateOrderEmrys(req.body.commandeBody, tokenEmrys, req.body.status);
    const updatedCommande = await commandeService.updateCommandeEmrys(req.body.commandeBody, updateOrderEmrys);
    res.status(httpStatus.OK).send(updatedCommande);
  } else {
    const updatedCommande = await commandeService.updateCommande(req.body.commandeBody, req.body);
    res.status(httpStatus.OK).send(updatedCommande);
  }
});

const updateGlobalCommande = catchAsync(async (req, res) => {
  const updatedCommande = await commandeService.updateCommande(req.body.commandeBody, req.body);
  res.status(httpStatus.OK).send(updatedCommande);
});

module.exports = {
  createCommande,
  getCommandes,
  updateCommande,
  updateGlobalCommande,
};
