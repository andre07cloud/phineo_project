const axios = require('axios');
const qs = require('qs');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { EmrysToken } = require('../models');
const ApiError = require('../utils/ApiError');
const { refreshTokenEmrys } = require('./auth.service');

const createEmrysToken = async () => {
  const createTokensEmrys = await axios({
    method: 'post',
    url: 'https://www.emryslacarte.fr/oauth/token',
    data: qs.stringify({
      grant_type: 'client_credentials',
      client_id: config.emrys.client,
      client_secret: config.emrys.secret,
      scope: ['external_order_creation', 'external_order', 'external_order_update_status'],
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });

  return createTokensEmrys;
};

const getEmrysToken = async () => {
  let token = await EmrysToken.findOne({ type: 'client_credentials' }).sort({ createdAt: '-1' });

  if (!token || token.createdAtUnix < Date.now() - 86400000) {
    token = await createEmrysToken();
    const tokenToCreate = { type: 'client_credentials', ...token };
    EmrysToken.create(tokenToCreate);
  }

  return token;
};

const checkEmrysUserToken = async (userBody) => {
  let userToken = await EmrysToken.findOne({ type: 'authorization_code', userId: userBody._id }).sort({ createdAt: '-1' });

  if (!userToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Emrys Reconnexion is Required');
  } else if (userToken.createdAtUnix < Date.now() - 86400000 && userToken.createdAtUnix > Date.now() - 2592000000) {
    console.log('Passe ici !');
    userToken = await refreshTokenEmrys(userToken.refresh_token);
    const tokenToCreate = { type: 'authorization_code', userId: userBody._id, ...userToken };
    EmrysToken.create(tokenToCreate);
  }

  return userToken;
};

module.exports = {
  getEmrysToken,
  createEmrysToken,
  checkEmrysUserToken,
};
