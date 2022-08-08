const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const coursesRoute = require('./course.route');
const emaiRoute = require('./email.route');
const sectionsRoute = require('./section.route');
const commandesRoute = require('./commande.route');
const logsRoute = require('./log.route');
const modulesRoute = require('./module.route');
const responsesRoute = require('./response.route');
const notificationRoute = require('./notification.route');
const correctionRoute = require('./correction.route');
const interactionRoute = require('./interaction.route');
const analyticsRoute = require('./analytics.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/courses',
    route: coursesRoute,
  },
  {
    path: '/email',
    route: emaiRoute,
  },
  {
    path: '/responses',
    route: responsesRoute,
  },
  {
    path: '/sections',
    route: sectionsRoute,
  },
  {
    path: '/commandes',
    route: commandesRoute,
  },
  {
    path: '/correction',
    route: correctionRoute,
  },
  {
    path: '/logs',
    route: logsRoute,
  },
  {
    path: '/modules',
    route: modulesRoute,
  },
  {
    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/analytics',
    route: analyticsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
