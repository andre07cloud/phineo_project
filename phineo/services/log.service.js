const httpStatus = require('http-status');
const axios = require('axios');
const qs = require('qs');
const { Log } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const createLog = async (userId, type, pageName, reqBody) => {
  const log = {
    userId,
    type,
    page_name: pageName,
    courseId: reqBody.courseId,
    moduleId: reqBody.moduleId,
  };
  return Log.create(log);
};

const createViewLog = async (userId, type, pageName) => {
  const log = {
    userId,
    type,
    page_name: pageName,
  };
  return Log.create(log);
};

const getLogsByCourseId = async (courseId) => {
  const logs = await Log.find({ courseId, type: 'visit' })
    .select('moduleId userId page_name type')
    .populate({
      path: 'userId',
      select: 'firstName lastName role',
    })
    .populate({
      path: 'moduleId',
      select: 'title',
    })
    .sort({ createdAt: -1 });
  return logs;
};

const materializeSessions = async (logs) => {
  function diffMinutes(comparativeTime, startTime) {
    let diff = (startTime.getTime() - comparativeTime) / 1000;
    diff /= 60;
    return Math.abs(diff.toFixed(2));
  }

  const connexions = [];
  let connexionNb;
  let currentConnexionStarter;
  let startDate;
  let timeCumulated = 0;
  const timeSession = 15;

  for (let x = 0; x < logs.length; x++) {
    if (x === 0) {
      currentConnexionStarter = x;
      connexionNb = 1;
      startDate = new Date(logs[x].createdAt);
    }

    if (x > 0 && x < logs.length - 1) {
      if (diffMinutes(new Date(logs[x - 1].createdAt), new Date(logs[x].createdAt)) > timeSession) {
        timeCumulated += diffMinutes(startDate, new Date(logs[x - 1].createdAt));

        const connexion = {
          connexionNb,
          startDate,
          endDate: logs[x - 1].createdAt,
          connexionTime: diffMinutes(startDate, new Date(logs[x - 1].createdAt)).toFixed(0),
          logIdStarter: logs[currentConnexionStarter]._id,
          logIdEnd: logs[x - 1]._id,
          timeCumulated: timeCumulated.toFixed(0),
        };

        connexions.push(connexion);

        connexionNb++;
        startDate = new Date(logs[x].createdAt);
        currentConnexionStarter = x;
      }
    }

    if (x === logs.length - 1) {
      if (diffMinutes(new Date(logs[x - 1].createdAt), new Date(logs[x].createdAt)) > timeSession) {
        timeCumulated += diffMinutes(startDate, new Date(logs[x - 1].createdAt));

        const connexion = {
          connexionNb,
          startDate,
          endDate: logs[x - 1].createdAt,
          connexionTime: diffMinutes(startDate, new Date(logs[x - 1].createdAt)).toFixed(0),
          logIdStarter: logs[currentConnexionStarter]._id,
          logIdEnd: logs[x - 1]._id,
          timeCumulated: timeCumulated.toFixed(0),
        };

        connexions.push(connexion);

        connexionNb++;
        startDate = new Date(logs[x].createdAt);
        currentConnexionStarter = x;

        const lastConnexion = {
          connexionNb,
          startDate,
          endDate: logs[x].createdAt,
          connexionTime: 1,
          logIdStarter: logs[currentConnexionStarter]._id,
          logIdEnd: logs[x]._id,
          timeCumulated: (1 + timeCumulated).toFixed(0),
        };

        connexions.push(lastConnexion);
      } else {
        timeCumulated += diffMinutes(startDate, new Date(logs[x].createdAt));

        const connexion = {
          connexionNb,
          startDate,
          endDate: logs[x].createdAt,
          connexionTime: diffMinutes(startDate, new Date(logs[x].createdAt)).toFixed(0),
          logIdStarter: logs[currentConnexionStarter]._id,
          logIdEnd: logs[x]._id,
          timeCumulated: timeCumulated.toFixed(0),
        };

        connexions.push(connexion);
      }
    }
  }

  return connexions;
};

const materializeTimeCumulatedSession = async (logs) => {
  function diffMinutes(comparativeTime, startTime) {
    let diff = (startTime.getTime() - comparativeTime) / 1000;
    diff /= 60;
    return Math.abs(diff.toFixed(2));
  }

  let startDate;
  let timeCumulated = 0;
  const timeSession = 15;

  for (let x = 0; x < logs.length; x++) {
    if (x === 0) {
      startDate = new Date(logs[x].createdAt);
    }

    if (x > 0 && x < logs.length - 1) {
      if (diffMinutes(new Date(logs[x - 1].createdAt), new Date(logs[x].createdAt)) > timeSession) {
        timeCumulated += diffMinutes(startDate, new Date(logs[x - 1].createdAt));
        startDate = new Date(logs[x].createdAt);
      }
    }

    if (x === logs.length - 1 && x > 0) {
      if (diffMinutes(new Date(logs[x - 1].createdAt), new Date(logs[x].createdAt)) > timeSession) {
        timeCumulated += diffMinutes(startDate, new Date(logs[x - 1].createdAt));
        startDate = new Date(logs[x].createdAt);
        timeCumulated += 1;
      } else {
        timeCumulated += diffMinutes(startDate, new Date(logs[x].createdAt));
      }
    }
  }

  return timeCumulated;
};

const getUserLogsByCourseId = async (userId, courseId) => {
  const logs = await Log.find({ userId, courseId })
    .select('moduleId userId page_name type createdAt')
    .sort({ createdAt: 1 });

  const connexions = await materializeSessions(logs);

  return connexions;
};

const getUserAllSessionsLogs = async (userId) => {
  const logs = await Log.find({ userId })
    .select('moduleId userId page_name type createdAt')
    .populate({
      path: 'userId',
      select: 'firstName lastName role',
    })
    .sort({ createdAt: 1 });

  const connexions = await materializeSessions(logs);

  return connexions;
};

const getUserTotalTimePassed = async (userId) => {
  const logs = await Log.find({ userId })
    .select('moduleId userId page_name type createdAt')
    .populate({
      path: 'userId',
      select: 'firstName lastName role',
    })
    .sort({ createdAt: 1 });

  const connexions = await materializeTimeCumulatedSession(logs);

  return connexions;
};

const getUserTimePassedOnCourse = async (userId, courseId) => {
  const logs = await Log.find({ userId, courseId })
    .select('moduleId userId page_name type createdAt')
    .populate({
      path: 'userId',
      select: 'firstName lastName role',
    })
    .sort({ createdAt: 1 });

  const connexions = await materializeTimeCumulatedSession(logs);

  return connexions;
};

module.exports = {
  createLog,
  createViewLog,
  getLogsByCourseId,
  getUserLogsByCourseId,
  getUserAllSessionsLogs,
  materializeSessions,
  materializeTimeCumulatedSession,
  getUserTotalTimePassed,
  getUserTimePassedOnCourse,
};
