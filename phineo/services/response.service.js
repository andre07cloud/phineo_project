const httpStatus = require('http-status');
const { Response, Course } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a response
 * @param {Object} responseBody
 * @returns {Promise<Response>}
 */
const createResponse = async (responseBody) => {
  return Response.create(responseBody);
};

/**
 * Query for responses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryResponses = async (filter, options) => {
  const responses = await Response.paginate(filter, options);
  return responses;
};

/**
 * Get response by id
 * @param {ObjectId} id
 * @returns {Promise<Response>}
 */
const getResponseById = async (id) => {
  return Response.findById(id);
};

const getModuleResponseById = async (response, id) => {
  for (x = 0; x < response.modulesResponse.length; x++) {
    if (response.modulesResponse[x].moduleId === id) {
      console.log('YALAH : ', response.modulesResponse[x]);
      return response.modulesResponse[x];
    }
  }
};

/**
 * Update response by id
 * @param {ObjectId} responseId
 * @param {Object} updateBody
 * @returns {Promise<Response>}
 */
const updateResponseById = async (responseId, updateBody) => {
  const response = await getResponseById(responseId);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Response not found');
  }

  const moduleResponse = await getModuleResponseById(response, updateBody.modulesResponse.moduleId);

  response.modulesResponse.remove(moduleResponse);
  response.modulesResponse.push(updateBody.modulesResponse);
  await response.save();
  return response;
};

/**
 * Delete response by id
 * @param {ObjectId} responseId
 * @returns {Promise<Response>}
 */
const deleteResponseById = async (responseId) => {
  const response = await getResponseById(responseId);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Response not found');
  }
  await response.remove();
  return response;
};

/**
 * Update response by id
 * @param {ObjectId} responseId
 * @param {Object} updateBody
 * @returns {Promise<Response>}
 */
const addModuleResponseById = async (responseId, updateBody) => {
  const course = await Course.findById(updateBody.courseId).populate({ path: 'sections', populate: { path: 'modules' } });
  const response = await Response.findById(responseId);
  if (!course || !response) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  for (let i = 0; i < response.modulesResponse.length; i++) {
    if (response.modulesResponse[i].moduleId === updateBody.moduleResponse.moduleId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Already one response');
    }
  }

  let moduleLenght = 0;
  course.sections.map((section) => {
    moduleLenght += section.modules.length;
  });
  const progressUpdated = (response.modulesResponse.length + 1) / moduleLenght;

  const responseUpdated = await Response.findByIdAndUpdate(
    { _id: responseId },
    { $addToSet: { modulesResponse: updateBody.moduleResponse }, progress: progressUpdated }
  );
  return responseUpdated;
};

module.exports = {
  createResponse,
  queryResponses,
  getResponseById,
  updateResponseById,
  deleteResponseById,
  addModuleResponseById,
};
