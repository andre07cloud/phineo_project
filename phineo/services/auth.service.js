const httpStatus = require('http-status');
const axios = require('axios');
const qs = require('qs');
const config = require('../config/config');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email ou Mot de Passe Incorrect');
  }
  if (user.isEmailVerified === false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email Non vérifié, Veuillez regarder votre Boite Mail');
  }
  await userService.updateUserById(user.id, { lastConnection: Date.now() });
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Veuillez vous identifier');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken, password) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true, password });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Login Emrys
 * @param {string} code
 * @returns {Promise<User>}
 */
const loginEmrys = async (code) => {
  const tokensEmrys = await axios({
    method: 'post',
    url: 'https://www.emryslacarte.fr/oauth/token',
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: config.emrys.client,
      client_secret: config.emrys.secret,
      code,
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

  return tokensEmrys;
};

/**
 * User Emrys
 * @param {string} tokensEmrys
 * @returns {Promise<User>}
 */
const userEmrys = async (tokensEmrys) => {
  const user = await axios({
    method: 'get',
    url: 'https://api.emryslacarte.fr/api/user/profile',
    headers: {
      Authorization: `Bearer ${tokensEmrys.access_token}`,
      'content-type': 'application/json',
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });

  return user;
};

/**
 * refreshTokenEmrys
 * @param {string} code
 * @returns {Promise<User>}
 */
const refreshTokenEmrys = async (refreshToken) => {
  const refrshTokensEmrys = await axios({
    method: 'post',
    url: 'https://www.emryslacarte.fr/oauth/token',
    data: qs.stringify({
      grant_type: 'refresh_token',
      client_id: config.emrys.client,
      client_secret: config.emrys.secret,
      refresh_token: refreshToken,
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

  return refrshTokensEmrys;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginEmrys,
  userEmrys,
  refreshTokenEmrys,
};
