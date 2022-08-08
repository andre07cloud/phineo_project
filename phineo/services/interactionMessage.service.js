const httpStatus = require('http-status');
const webpush = require('web-push');
const schedule = require('node-schedule');
const Agenda = require('agenda');
const axios = require('axios');
const { userService } = require('.');

const { Message, InteractionMessage, Course, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { addDaysToDateWithHours } = require('../utils/dateFunction');

/**
 * Create an interaction
 * @param {Object} interactionBody
 * @returns {Promise<InteractionMessage>}
 */
const createInteractionMessage = async (courseId, interactionBody) => {
  const interaction = await InteractionMessage.create(interactionBody);
  const course = await Course.findByIdAndUpdate({ _id: courseId }, { $addToSet: { interactions: interaction.id } });
  console.log('COURSE =====', course);
  return interaction;
};

/**
 * Create an interaction
 * @param {Object} interactionBody
 * @returns {Promise<InteractionMessage>}
 */
const onlyCreateInteractionMessage = async (interactionBody) => {
  const interaction = await InteractionMessage.create(interactionBody);
  return interaction;
};

/**
 * Query for interaction
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInteractionsMessage = async (filter, options) => {
  const interactions = await InteractionMessage.paginate(filter, options);
  return interactions;
};

/**
 * Query for interaction
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInteractionsMessageToCreateCron = async () => {
  const courseToCheck = await Course.find({ interactions: { $exists: true, $type: 'array', $ne: [] } })
    .populate('interactions')
    .populate({ path: 'assignments', populate: { path: 'user' } });

  console.log('coucou', courseToCheck);

  /*

  const currentDate = new Date();

  courseToCheck.map((course) => {
    course.assignments.map((user) => {
      const userAssignmentDate = new Date(user.beginDate);

      if (userAssignmentDate > currentDate) {
        return;
      }

      const previousDates = course.interactions.filter(
        (e) => currentDate - addDaysToDateWithHours(userAssignmentDate, e.daysAfter, e.hourOfTheDay) > 0
      );
      const sortedPreviousDates = previousDates.sort(
        (a, b) =>
          addDaysToDateWithHours(userAssignmentDate, a.daysAfter, a.hourOfTheDay) -
          addDaysToDateWithHours(userAssignmentDate, b.daysAfter, b.hourOfTheDay)
      );

      if (sortedPreviousDates[0]) {
        const interactionToSend = sortedPreviousDates[0];
        const userId = user.user.id;
        const date = addDaysToDateWithHours(userAssignmentDate, interactionToSend.daysAfter, interactionToSend.hourOfTheDay);
        // const date = new Date(2022, 02, 23, 15, 26, 0);

        console.log(date, currentDate);
        if (currentDate > date) {
          console.log('DATE RETURN ======');
          return;
        }

        const jobScheduleList = schedule.scheduledJobs;
        console.log('JOB LIST =====', schedule.scheduledJobs);

        if (jobScheduleList[userId]) {
          console.log('CRON ALREADY WRITE =====');
          return;
        }

        console.log('WRITE CRON =====', userId, date);
        const job = schedule.scheduleJob(userId, date, async function () {
          console.log('The world is going to begin today.');
          await User.findByIdAndUpdate({ _id: userId }, { $addToSet: { interactions: interactionToSend } });

          // if (user.subscription) {
          //     const payload = JSON.stringify({ title: 'Push Test' });
          //     const webPush = await webpush.sendNotificggation(user.subscription, payload)
          // }
          console.log('The world is going to end today.');
        });
        console.log('END WRITE CRON =====');
      }

      // const interaction = user.interactions[user.interactions.length - 1];
      // if (interaction.finished) {
      //     return
      // };
      // const date = addDaysToDateWithHours(interaction.assignmentDate, interaction.daysAfter, interaction.hourOfTheDay);

      // if (date > new Date()) {
      //     schedule.scheduleJob(scheduleDate, function () {
      //         console.log('The world is going to end today.');
      //     });
      //     // createScheduleCronWithSpecificDate(date, user.id);
      // };
    });
  });

  console.log('QUERY FOR CRON END =====');
  return courseToCheck;
  */
};

/**
 * Get interaction by id
 * @param {ObjectId} id
 * @returns {Promise<InteractionMessage>}
 */
const getCourseInteractionMessageById = async (courseId) => {
  const course = await Course.findById(courseId).populate('interactions');
  if (course.interactions) {
    return course.interactions;
  }
  return [];
};

/**
 * Get interaction by id
 * @param {ObjectId} id
 * @returns {Promise<InteractionMessage>}
 */
const getInteractionMessageById = async (id) => {
  const interaction = await InteractionMessage.findById(id);
  return interaction;
};

/**
 * Update interaction message by id
 * @param {ObjectId} interactionMessageId
 * @param {Object} updateBody
 * @returns {Promise<InteractionMessage>}
 */
const updateInteractionById = async (interactionMessageId, updateBody) => {
  const interaction = await getInteractionMessageById(interactionMessageId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }

  Object.assign(interaction, updateBody);
  await interaction.save();
  return interaction;
};

/**
 * Delete interaction by id
 * @param {ObjectId} interactionId
 * @returns {Promise<InteractionMessage>}
 */
const deleteInteractionMessageById = async (courseId, interactionId) => {
  await Course.findByIdAndUpdate({ _id: courseId }, { $pull: { interactions: interactionId } });
  const interaction = await getInteractionMessageById(interactionId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  await interaction.remove();
  return interaction;
};

/**
 *
 * Quentin
 *
 */

const sendNotification = async (data) => {
  const dateNow = new Date(Date.now());
  let sendAfter;
  if (dateNow < data.serverDate) {
    sendAfter = data.serverDate;
  }

  try {
    axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: '237c6336-acf3-4c83-9e9b-3d7ee0d72bff',
        include_external_user_ids: [data.userId],
        send_after: sendAfter,
        url: `https://plateforme.phineo.co/interactions/${data.courseId}`,
        headings: {
          en: 'La Plateforme Phineo.co',
        },
        subtitle: {
          en: 'plateforme.phineo.co',
        },
        contents: {
          en: data.message,
        },
        name: 'INTERACTION_SEND_BEGIN_MESSAGE',
      },
      {
        headers: {
          Authorization: `Basic OWI0YTVmMTQtMTA0Ny00ZThhLWI0YWItZDVjZmEyYzc4ZmJm`,
        },
      }
    );
  } catch (err) {
    console.log('erreur send notif : ', err);
    throw err;
  }
};

const sendEmrysNotification = async (data) => {
  const dateNow = new Date(Date.now());
  let sendAfter;
  if (dateNow < data.serverDate) {
    sendAfter = data.serverDate;
  }

  try {
    axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: '237c6336-acf3-4c83-9e9b-3d7ee0d72bff',
        include_external_user_ids: [data.userId],
        send_after: sendAfter,
        url: `https://laformationenchantee.phineo.co/interactions/${data.courseId}`,
        headings: {
          en: 'La Formation Enchantée',
        },
        subtitle: {
          en: 'laformationenchantee.phineo.co',
        },
        contents: {
          en: data.message,
        },
        name: 'INTERACTION_SEND_BEGIN_MESSAGE',
      },
      {
        headers: {
          Authorization: `Basic OWI0YTVmMTQtMTA0Ny00ZThhLWI0YWItZDVjZmEyYzc4ZmJm`,
        },
      }
    );
  } catch (err) {
    console.log('erreur send notif : ', err);
    throw err;
  }
};

const interactionFirstMessage = async () => {
  const currentDate = Date.now();

  const coursesToAvoid = [
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

  const courses = await Course.find({
    $and: [{ _id: { $nin: coursesToAvoid } }, { visible: true }, { _id: '624bfbe3f16fdf51da676ce4' }],
  }).select('_id title assignments interactions');

  for (let nbCourse = 0; nbCourse < 1 /* courses.length */; nbCourse++) {
    /* eslint-disable no-await-in-loop */
    const interactionMessages = await InteractionMessage.find({ _id: { $in: courses[nbCourse].interactions } }).select(
      '_id daysAfter hourOfTheDay minuteOfTheDay content'
    );

    for (let nbUserAssigned = 0; nbUserAssigned < courses[nbCourse].assignments.length; nbUserAssigned++) {
      const beginDate = new Date(courses[nbCourse].assignments[nbUserAssigned].beginDate).getTime();
      const diffDate = Math.floor((currentDate - beginDate) / 1000 / 60 / 60 / 24);
      let nodeId = '';
      let nodeType = '';
      let endFinded = false;

      for (let nbInteractionMessage = 0; nbInteractionMessage < interactionMessages.length; nbInteractionMessage++) {
        if (diffDate === interactionMessages[nbInteractionMessage].daysAfter) {
          for (
            let nodeNumber = 0;
            nodeNumber < interactionMessages[nbInteractionMessage].content.nodes.length;
            nodeNumber++
          ) {
            if (interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].type === 'BeginType') {
              nodeId = interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].id;
              nodeType = interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].type;

              const dateEvent = new Date(Date.now());
              dateEvent.setHours(
                interactionMessages[nbInteractionMessage].hourOfTheDay,
                interactionMessages[nbInteractionMessage].minuteOfTheDay,
                0
              );

              const serverEventDate = new Date(Date.now());
              serverEventDate.setHours(
                interactionMessages[nbInteractionMessage].hourOfTheDay,
                interactionMessages[nbInteractionMessage].minuteOfTheDay,
                0
              );

              const message = {
                userId: courses[nbCourse].assignments[nbUserAssigned].user,
                courseId: courses[nbCourse]._id,
                interractionId: interactionMessages[nbInteractionMessage]._id,
                message: interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].data.label,
                displayDate: dateEvent,
                serverDate: serverEventDate,
                nodeType: interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].type,
                nodeId: interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].id,
              };

              const checkIfAlreadyExist = await Message.findOne({
                userId: courses[nbCourse].assignments[nbUserAssigned].user,
                courseId: courses[nbCourse]._id,
                interractionId: interactionMessages[nbInteractionMessage]._id,
                nodeId: interactionMessages[nbInteractionMessage].content.nodes[nodeNumber].id,
              }).sort({ createdAt: '-1' });

              if (!checkIfAlreadyExist) {
                await Message.create(message);
                const user = await User.findById(courses[nbCourse].assignments[nbUserAssigned].user).select('role');

                if (user.role === 'emrys') {
                  sendEmrysNotification(message);
                } else {
                  sendNotification(message);
                }
              }

              break;
            }
          }

          while (endFinded === false) {
            for (
              let edgeNumber = 0;
              edgeNumber < interactionMessages[nbInteractionMessage].content.edges.length;
              edgeNumber++
            ) {
              if (interactionMessages[nbInteractionMessage].content.edges[edgeNumber].source === nodeId) {
                nodeId = interactionMessages[nbInteractionMessage].content.edges[edgeNumber].target;
                break;
              }

              if (edgeNumber === interactionMessages[nbInteractionMessage].content.edges.length - 1) {
                endFinded = true;
              }
            }

            if (!endFinded) {
              for (
                let searchNode = 0;
                searchNode < interactionMessages[nbInteractionMessage].content.nodes.length;
                searchNode++
              ) {
                if (interactionMessages[nbInteractionMessage].content.nodes[searchNode].id === nodeId) {
                  nodeType = interactionMessages[nbInteractionMessage].content.nodes[searchNode].type;
                  nodeId = interactionMessages[nbInteractionMessage].content.nodes[searchNode].id;

                  const dateEvent = new Date(Date.now());
                  dateEvent.setHours(
                    interactionMessages[nbInteractionMessage].hourOfTheDay,
                    interactionMessages[nbInteractionMessage].minuteOfTheDay,
                    searchNode + 1
                  );

                  const serverEventDate = new Date(Date.now());
                  serverEventDate.setHours(
                    interactionMessages[nbInteractionMessage].hourOfTheDay,
                    interactionMessages[nbInteractionMessage].minuteOfTheDay,
                    0
                  );

                  if (nodeType === 'AddTagToUser' || nodeType === 'RemoveTagToUser') {
                    const user = await userService.getUserById(courses[nbCourse].assignments[nbUserAssigned].user);

                    let haveTag = false;
                    for (let userTags = 0; userTags < user.tags.length; userTags++) {
                      if (
                        user.tags[userTags].tagId ==
                        interactionMessages[nbInteractionMessage].content.nodes[searchNode].data.label
                      ) {
                        if (nodeType === 'AddTagToUser') {
                          user.tags[userTags] = {
                            _id: user.tags[userTags]._id,
                            courseId: user.tags[userTags].courseId,
                            tagId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].data.label,
                            disabledDate: user.tags[userTags].disabledDate,
                            enableDate: serverEventDate,
                          };
                          await user.save();
                          haveTag = true;
                          break;
                        }

                        if (nodeType === 'RemoveTagToUser') {
                          user.tags[userTags] = {
                            _id: user.tags[userTags]._id,
                            courseId: user.tags[userTags].courseId,
                            tagId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].data.label,
                            disabledDate: serverEventDate,
                            enableDate: user.tags[userTags].enableDate,
                          };
                          await user.save();
                          haveTag = true;
                          break;
                        }
                      }
                    }

                    if (!haveTag) {
                      if (nodeType === 'AddTagToUser') {
                        const tagToAdd = {
                          tagId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].data.label,
                          enableDate: serverEventDate,
                          courseId: courses[nbCourse]._id,
                        };
                        user.tags.push(tagToAdd);
                        await user.save();
                      }

                      if (nodeType === 'RemoveTagToUser') {
                        const tagToDelete = {
                          tagId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].data.label,
                          enableDate: serverEventDate,
                          disabledDate: serverEventDate,
                          courseId: courses[nbCourse]._id,
                        };
                        user.tags.push(tagToDelete);
                        await user.save();
                      }
                    }
                  } else if (nodeType === 'TagsConditionBegin') {
                    const message = {
                      userId: courses[nbCourse].assignments[nbUserAssigned].user,
                      courseId: courses[nbCourse]._id,
                      interractionId: interactionMessages[nbInteractionMessage]._id,
                      message: 'TAGS_CHECK',
                      displayDate: dateEvent,
                      serverDate: serverEventDate,
                      nodeType: interactionMessages[nbInteractionMessage].content.nodes[searchNode].type,
                      nodeId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].id,
                    };

                    const checkIfAlreadyExist = await Message.findOne({
                      userId: courses[nbCourse].assignments[nbUserAssigned].user,
                      courseId: courses[nbCourse]._id,
                      interractionId: interactionMessages[nbInteractionMessage]._id,
                      nodeId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].id,
                    }).sort({ createdAt: '-1' });

                    if (!checkIfAlreadyExist) {
                      await Message.create(message);
                    }
                  } else if (nodeType === 'MessagePersonnalizedTag') {
                    const message = {
                      userId: courses[nbCourse].assignments[nbUserAssigned].user,
                      courseId: courses[nbCourse]._id,
                      interractionId: interactionMessages[nbInteractionMessage]._id,
                      message: 'MESSAGE_PERSONNALIZED_CHECK_1256',
                      displayDate: dateEvent,
                      serverDate: serverEventDate,
                      nodeType: interactionMessages[nbInteractionMessage].content.nodes[searchNode].type,
                      nodeId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].id,
                    };

                    const checkIfAlreadyExist = await Message.findOne({
                      userId: courses[nbCourse].assignments[nbUserAssigned].user,
                      courseId: courses[nbCourse]._id,
                      interractionId: interactionMessages[nbInteractionMessage]._id,
                      nodeId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].id,
                    }).sort({ createdAt: '-1' });

                    if (!checkIfAlreadyExist) {
                      await Message.create(message);
                    }
                  } else {
                    const message = {
                      userId: courses[nbCourse].assignments[nbUserAssigned].user,
                      courseId: courses[nbCourse]._id,
                      interractionId: interactionMessages[nbInteractionMessage]._id,
                      message: interactionMessages[nbInteractionMessage].content.nodes[searchNode].data.label,
                      displayDate: dateEvent,
                      serverDate: serverEventDate,
                      nodeType: interactionMessages[nbInteractionMessage].content.nodes[searchNode].type,
                      nodeId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].id,
                    };

                    const checkIfAlreadyExist = await Message.findOne({
                      userId: courses[nbCourse].assignments[nbUserAssigned].user,
                      courseId: courses[nbCourse]._id,
                      interractionId: interactionMessages[nbInteractionMessage]._id,
                      nodeId: interactionMessages[nbInteractionMessage].content.nodes[searchNode].id,
                    }).sort({ createdAt: '-1' });

                    if (!checkIfAlreadyExist) {
                      await Message.create(message);
                    }
                  }

                  break;
                }
              }
            }

            if (
              nodeType === 'QuestionType' ||
              nodeType === 'EndType' ||
              nodeType === 'TagsConditionBegin' ||
              nodeType === 'MessagePersonnalizedTag'
            ) {
              endFinded = true;
            }
          }

          endFinded = false;
        }
      }
    }
  }
};

const getResponseNodeToDisplay = async (interractionId, nodeId) => {
  const interraction = await InteractionMessage.findById(interractionId);
  const responses = [];

  for (let i = 0; i < interraction.content.edges.length; i++) {
    if (interraction.content.edges[i].source === nodeId) {
      for (let x = 0; x < interraction.content.nodes.length; x++) {
        if (
          interraction.content.nodes[x].id === interraction.content.edges[i].target &&
          interraction.content.nodes[x].type === 'AnswerType'
        ) {
          responses.push(interraction.content.nodes[x]);
          break;
        }
      }
    }
  }

  return responses;
};

const createUserAnswerMessage = async (userId, courseId, data, interactionId) => {
  const date = new Date(Date.now());

  const message = {
    userId,
    courseId,
    interractionId: interactionId,
    message: data.data.label,
    displayDate: date,
    serverDate: date,
    nodeType: 'AnswerType',
    nodeId: data.id,
  };

  const checkIfAlreadyExist = await Message.findOne({
    userId,
    courseId,
    interractionId: interactionId,
    nodeId: data.id,
  }).sort({ createdAt: '-1' });

  if (!checkIfAlreadyExist) {
    await Message.create(message);
  }
};

const returnTheSuitOfInteraction = async (userId, courseId, dataNodeId, interactionId) => {
  let nodeId = dataNodeId;
  let nodeType;
  let endFinded = false;

  const interaction = await getInteractionMessageById(interactionId);

  while (endFinded === false) {
    for (let edgeNumber = 0; edgeNumber < interaction.content.edges.length; edgeNumber++) {
      if (interaction.content.edges[edgeNumber].source === nodeId) {
        nodeId = interaction.content.edges[edgeNumber].target;
        break;
      }

      if (edgeNumber === interaction.content.edges.length - 1) {
        endFinded = true;
      }
    }

    if (!endFinded) {
      for (let searchNode = 0; searchNode < interaction.content.nodes.length; searchNode++) {
        if (interaction.content.nodes[searchNode].id === nodeId) {
          nodeType = interaction.content.nodes[searchNode].type;
          nodeId = interaction.content.nodes[searchNode].id;

          if (nodeType === 'AddTagToUser' || nodeType === 'RemoveTagToUser') {
            const user = await userService.getUserById(userId);
            let haveTag = false;

            for (let userTags = 0; userTags < user.tags.length; userTags++) {
              if (user.tags[userTags].tagId == interaction.content.nodes[searchNode].data.label) {
                if (nodeType === 'AddTagToUser') {
                  user.tags[userTags] = {
                    _id: user.tags[userTags]._id,
                    courseId: user.tags[userTags].courseId,
                    tagId: interaction.content.nodes[searchNode].data.label,
                    disabledDate: user.tags[userTags].disabledDate,
                    enableDate: new Date(Date.now()),
                  };
                  await user.save();
                  haveTag = true;
                  break;
                }

                if (nodeType === 'RemoveTagToUser') {
                  user.tags[userTags] = {
                    _id: user.tags[userTags]._id,
                    courseId: user.tags[userTags].courseId,
                    tagId: interaction.content.nodes[searchNode].data.label,
                    disabledDate: new Date(Date.now()),
                    enableDate: user.tags[userTags].enableDate,
                  };
                  await user.save();
                  haveTag = true;
                  break;
                }
              }
            }

            if (!haveTag) {
              if (nodeType === 'AddTagToUser') {
                const tagToAdd = {
                  tagId: interaction.content.nodes[searchNode].data.label,
                  enableDate: new Date(Date.now()),
                  courseId,
                };
                user.tags.push(tagToAdd);
                await user.save();
              }

              if (nodeType === 'RemoveTagToUser') {
                const tagToDelete = {
                  tagId: interaction.content.nodes[searchNode].data.label,
                  enableDate: new Date(Date.now()),
                  disabledDate: new Date(Date.now()),
                  courseId,
                };
                user.tags.push(tagToDelete);
                await user.save();
              }
            }
          } else if (nodeType === 'TagsConditionBegin') {
            let numberOfNoTag;
            let userHaveTag = false;

            const userTags = await userService.getUserTagsById(userId);

            for (let edgeNumberTags = 0; edgeNumberTags < interaction.content.edges.length; edgeNumberTags++) {
              if (interaction.content.edges[edgeNumberTags].source === nodeId) {
                for (
                  let nodeNumberTagCondition = 0;
                  nodeNumberTagCondition < interaction.content.nodes.length;
                  nodeNumberTagCondition++
                ) {
                  if (
                    interaction.content.edges[edgeNumberTags].target ===
                      interaction.content.nodes[nodeNumberTagCondition].id &&
                    interaction.content.nodes[nodeNumberTagCondition].type === 'TagCondition'
                  ) {
                    if (interaction.content.nodes[nodeNumberTagCondition].data.label === 'TagCondition') {
                      numberOfNoTag = nodeNumberTagCondition;
                    } else {
                      for (let tags = 0; tags < userTags.tags.length; tags++) {
                        if (userTags.tags[tags].tagId == interaction.content.nodes[nodeNumberTagCondition].data.label) {
                          if (userTags.tags[tags].enableDate < new Date(Date.now())) {
                            if (
                              userTags.tags[tags].disabledDate == null ||
                              new Date(Date.now()) < userTags.tags[tags].disabledDate
                            ) {
                              userHaveTag = true;
                              nodeId = interaction.content.nodes[nodeNumberTagCondition].id;
                            } else {
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            if (!userHaveTag) {
              nodeId = interaction.content.nodes[numberOfNoTag].id;
            }
          } else {
            const message = {
              userId,
              courseId,
              interractionId: interaction._id,
              message: interaction.content.nodes[searchNode].data.label,
              displayDate: new Date(Date.now()),
              serverDate: new Date(Date.now()),
              nodeType: interaction.content.nodes[searchNode].type,
              nodeId: interaction.content.nodes[searchNode].id,
            };

            const checkIfAlreadyExist = await Message.findOne({
              userId,
              courseId,
              interractionId: interaction._id,
              nodeId: interaction.content.nodes[searchNode].id,
            }).sort({ createdAt: '-1' });

            if (!checkIfAlreadyExist) {
              await Message.create(message);
            }
          }

          break;
        }
      }
    }

    if (nodeType === 'QuestionType' || nodeType === 'EndType') {
      endFinded = true;
    }
  }
};

const createPersonalizedMessageAtRestart = async (userId, courseId, interactionId, nodeId) => {
  let userHaveTag = false;

  const userTags = await userService.getUserTagsById(userId);
  const interaction = await InteractionMessage.findById(interactionId);

  for (let x = 0; x < interaction.content.nodes.length; x++) {
    if (interaction.content.nodes[x].id === nodeId) {
      for (let y = 0; y < interaction.content.nodes[x].data.custom.length; y++) {
        for (let tags = 0; tags < userTags.tags.length; tags++) {
          if (userTags.tags[tags].tagId == interaction.content.nodes[x].data.custom[y].tagId) {
            if (userTags.tags[tags].enableDate < new Date(Date.now())) {
              if (userTags.tags[tags].disabledDate == null || new Date(Date.now()) < userTags.tags[tags].disabledDate) {
                userHaveTag = true;

                const message = {
                  userId,
                  courseId,
                  interractionId: interaction._id,
                  message: interaction.content.nodes[x].data.custom[y].label,
                  displayDate: new Date(Date.now()),
                  serverDate: new Date(Date.now()),
                  nodeType: interaction.content.nodes[x].type,
                  nodeId: interaction.content.nodes[x].id,
                };

                const checkIfAlreadyExist = await Message.findOne({
                  userId,
                  courseId,
                  interractionId: interaction._id,
                  nodeId: interaction.content.nodes[x].id,
                }).sort({ createdAt: '-1' });

                if (!checkIfAlreadyExist || checkIfAlreadyExist.message === 'MESSAGE_PERSONNALIZED_CHECK_1256') {
                  await Message.create(message);
                }
              } else {
                break;
              }
            }
          }
        }
      }

      if (!userHaveTag) {
        const message = {
          userId,
          courseId,
          interractionId: interaction._id,
          message: interaction.content.nodes[x].data.label,
          displayDate: new Date(Date.now()),
          serverDate: new Date(Date.now()),
          nodeType: interaction.content.nodes[x].type,
          nodeId: interaction.content.nodes[x].id,
        };

        const checkIfAlreadyExist = await Message.findOne({
          userId,
          courseId,
          interractionId: interaction._id,
          nodeId: interaction.content.nodes[x].id,
        }).sort({ createdAt: '-1' });

        if (!checkIfAlreadyExist || checkIfAlreadyExist.message === 'MESSAGE_PERSONNALIZED_CHECK_1256') {
          await Message.create(message);
        }
      }

      break;
    }
  }
};

module.exports = {
  onlyCreateInteractionMessage,
  createInteractionMessage,
  queryInteractionsMessage,
  queryInteractionsMessageToCreateCron,
  getCourseInteractionMessageById,
  getInteractionMessageById,
  updateInteractionById,
  deleteInteractionMessageById,
  interactionFirstMessage,
  getResponseNodeToDisplay,
  createUserAnswerMessage,
  sendEmrysNotification,
  returnTheSuitOfInteraction,
  createPersonalizedMessageAtRestart,
};
