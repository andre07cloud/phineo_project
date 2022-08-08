const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (msg) => {
  // const msg = { from: config.email.from, to, subject, text };
  // await transport.sendMail(msg);
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const resetPasswordUrl = `${config.webSiteUrl}reset-password/${token}`;
  sgMail.setApiKey(config.email.sendGrid);

  try {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'no-reply@phineo.co',
          name: "L'Équipe Phineo",
        },
        personalizations: [
          {
            to: [{ email: to }],
            dynamic_template_data: {
              url: resetPasswordUrl,
            },
          },
        ],
        template_id: 'd-0422f05a96d444b49b8a8003d95ddcdf',
      },
      {
        headers: {
          Authorization: `Bearer ${config.email.sendGrid}`,
        },
        responseType: 'json',
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
    throw err;
  }
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const verificationEmailUrl = `${config.webSiteUrl}auth/confirm-email/${token}`;
  sgMail.setApiKey(config.email.sendGrid);

  try {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'no-reply@phineo.co',
          name: "L'Équipe Phineo",
        },
        personalizations: [
          {
            to: [{ email: to }],
            dynamic_template_data: {
              url: verificationEmailUrl,
            },
          },
        ],
        template_id: 'd-c04ef8871e104830b80371f790594a5c',
      },
      {
        headers: {
          Authorization: `Bearer ${config.email.sendGrid}`,
        },
        responseType: 'json',
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
    throw err;
  }
};

const sendSupportEmail = async (emailData, firstNameData, messageData, userIdData) => {
  sgMail.setApiKey(config.email.sendGrid);

  try {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'no-reply@phineo.co',
          name: "L'Équipe Phineo",
        },
        personalizations: [
          {
            to: [{ email: 'formation@phineo.co' }],
            dynamic_template_data: {
              email: emailData,
              firstName: firstNameData,
              message: messageData,
              userId: userIdData,
            },
          },
        ],
        template_id: 'd-f1a115095d944ce89082bbfbe2a4c188',
      },
      {
        headers: {
          Authorization: `Bearer ${config.email.sendGrid}`,
        },
        responseType: 'json',
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
    throw err;
  }
};

const sendInscriptionCourseEmail = async (
  emailData,
  firstNameData,
  cpfData,
  tempsData,
  offreData,
  messageData,
  userIdData
) => {
  sgMail.setApiKey(config.email.sendGrid);

  try {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'no-reply@phineo.co',
          name: "L'Équipe Phineo",
        },
        personalizations: [
          {
            to: [{ email: 'formation@phineo.co' }],
            cc: [{ email: 'noreply.phineo@gmail.com' }],
            dynamic_template_data: {
              email: emailData,
              firstName: firstNameData,
              cpf: cpfData,
              temps: tempsData,
              offre: offreData,
              message: messageData,
              userId: userIdData,
            },
          },
        ],
        template_id: 'd-f16b4676bfa74ae6afb5831e9a19deea',
      },
      {
        headers: {
          Authorization: `Bearer ${config.email.sendGrid}`,
        },
        responseType: 'json',
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
    throw err;
  }
};

const sendTeacherSupportEmail = async (emailData, firstNameData, messageData, teacherEmail) => {
  sgMail.setApiKey(config.email.sendGrid);

  try {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'no-reply@phineo.co',
          name: "L'Équipe Phineo",
        },
        personalizations: [
          {
            to: [{ email: teacherEmail }],
            cc: [{ email: 'formateur@phineo.co' }],
            dynamic_template_data: {
              email: emailData,
              firstName: firstNameData,
              message: messageData,
            },
          },
        ],
        template_id: 'd-ddeec391f81f4d59b457d33747315bcc',
      },
      {
        headers: {
          Authorization: `Bearer ${config.email.sendGrid}`,
        },
        responseType: 'json',
      }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
    throw err;
  }
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendSupportEmail,
  sendInscriptionCourseEmail,
  sendTeacherSupportEmail,
};
