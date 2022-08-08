const httpStatus = require('http-status');
const { Interaction, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { updateUserById } = require('./user.service');
const { addDaysToDateWithHours } = require('../utils/dateFunction');

/**
 * Create an interaction
 * @param {Object} interactionBody
 * @returns {Promise<Interaction>}
 */
const createInteraction = async (interactionBody) => {
  const interaction = await Interaction.create(interactionBody);
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
const queryInteractions = async (filter, options) => {
  const interactions = await Interaction.paginate(filter, options);
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
const queryInteractionsToCreateCron = async () => {
  console.log('QUERY FOR CRON BEGIN =====');
  const usersToCheck = await User.find({ interactions: { $exists: true, $type: 'array', $ne: [] } });

  usersToCheck.map((user) => {
    const interaction = user.interactions[user.interactions.length - 1];
    if (interaction.finished) {
      return;
    }
    const date = addDaysToDateWithHours(
      interaction.assignmentDate,
      interaction.daysAfter,
      interaction.hourOfTheDay,
      interaction.minuteOfTheDay
    );

    if (date > new Date()) {
      schedule.scheduleJob(scheduleDate, function () {
        console.log('The world is going to end today.');
      });
      // createScheduleCronWithSpecificDate(date, user.id);
    }
  });

  console.log('QUERY FOR CRON END =====');
  return usersToCheck;
};

/**
 * Get interaction by id
 * @param {ObjectId} id
 * @returns {Promise<Interaction>}
 */
const getInteractionById = async (id) => {
  const interaction = await Interaction.findById(id);
  return interaction;
};

/**
 * Get interaction with sections by id
 * @param {ObjectId} id
 * @returns {Promise<Interaction>}
 */
const getFullInteractionById = async (id) => {
  const interaction = await Interaction.findById(id).populate('interactions').populate('users');
  return interaction;
};

/**
 * Update interaction by id
 * @param {ObjectId} interactionId
 * @param {Object} updateBody
 * @returns {Promise<Interaction>}
 */
const updateInteractionAssignmentsById = async (interactionId, updateBody) => {
  const interaction = await getFullInteractionById(interactionId);

  if (updateBody.assignments) {
    await Promise.all(
      updateBody.assignments.map(async (item) => {
        if (!interaction.users.includes(item)) {
          await User.findByIdAndUpdate({ _id: item }, { $addToSet: { interactions: interaction } });
        }
      })
    );
    interaction.users = updateBody.assignments;
  } else {
    return null;
  }

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
 * @returns {Promise<Interaction>}
 */
const deleteInteractionById = async (interactionId) => {
  const interaction = await getInteractionById(interactionId);
  if (!interaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interaction not found');
  }
  await interaction.remove();
  return interaction;
};

module.exports = {
  createInteraction,
  queryInteractions,
  queryInteractionsToCreateCron,
  getInteractionById,
  getFullInteractionById,
  updateInteractionAssignmentsById,
  deleteInteractionById,
};
