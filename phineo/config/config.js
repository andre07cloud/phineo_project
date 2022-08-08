const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL, // + (envVars.NODE_ENV === 'test' ? 'test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: envVars.DBUSERNAME, 
      pass: envVars.DBPWD
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationDays: envVars.JWT_RESET_PASSWORD_EXPIRATION_DAYS,
    verifyEmailExpirationDays: envVars.JWT_VERIFY_EMAIL_EXPIRATION_DAYS,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
    sendGrid: envVars.SENDGRID_API_KEY,
  },
  aws: {
    bucketName: envVars.AWS_BUCKET_NAME,
    region: envVars.AWS_BUCKET_REGION,
    accessKeyId: envVars.AWS_ACCESS_KEY,
    secretAccessKey: envVars.AWS_SECRET_KEY,
  },
  webPush: {
    public: envVars.WEB_PUSH_PUBLIC_KEY,
    private: envVars.WEB_PUSH_PRIVATE_KEY,
  },
  webSiteUrl: envVars.WEB_SITE_URL,
  emrys: {
    client: envVars.EMRYS_CLIENT_ID,
    secret: envVars.EMRYS_CLIENT_SECRET,
  },
  cloudflareImage: envVars.CLOUDFLARE_IMAGE,
};
