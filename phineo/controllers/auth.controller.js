const httpStatus = require('http-status');
const randomString = require('../utils/randomString');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { EmrysToken } = require('../models');
const { authService, userService, tokenService, emailService } = require('../services');
const { addUniqueAssignementById } = require('../services/assignments.sevice');

const register = catchAsync(async (req, res) => {
  req.body.password = `${randomString(10)}5`;
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const registerEmrys = catchAsync(async (req, res) => {
  req.body.password = `${randomString(10)}5`;
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  const courseId = '625056b616f562c67ee6bfdf';
  addUniqueAssignementById(courseId, user.id);

  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const Emryslogin = catchAsync(async (req, res) => {
  const { code } = req.body;
  const tokensEmrys = await authService.loginEmrys(code);
  const userEmrys = await authService.userEmrys(tokensEmrys);

  if (userEmrys.response && userEmrys.response.status > 400) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Une Erreur est Survenue... Merci de Réessayer plus tard.');
  }

  let user = await userService.getUserByUid(userEmrys.uid);
  const userByEmail = await userService.getUserByEmail(userEmrys.email);

  if (!user && !userByEmail) {
    console.log('Emrys User creation loading ... ');
    userEmrys.role = 'emrys';
    userEmrys.isEmailVerified = true;
    user = await userService.createUser(userEmrys);
    const courseId = [
      '625056b616f562c67ee6bfdf',
      '627cef43454b0c003e41bdcc',
      '627bec5777fb3126e504d199',
      '627bec7077fb31f81404d1a7',
      '627bec9a8f6df33efde535aa',
      '627becae8f6df33b30e535b1',
      '627becc28f6df3f02de535bd',
      '627becdd77fb31415804d1c7',
      '627becee77fb31c15804d1ce',
      '627bed038f6df32dd0e535cf',
    ];
    for (let x = 0; x < courseId.length; x++) {
      addUniqueAssignementById(courseId[x], user.id);
    }
  } else if (!user && userByEmail) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Cet Email est déjà utilisé pour un compte Phineo.co !');
  }

  await userService.updateUserById(user.id, { lastConnection: Date.now() });
  const tokenToCreate = { type: 'authorization_code', userId: user.id, ...tokensEmrys };
  await EmrysToken.create(tokenToCreate);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  register,
  registerEmrys,
  login,
  Emryslogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
