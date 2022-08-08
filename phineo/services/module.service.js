const httpStatus = require('http-status');
const { Module, Section } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a module
 * @param {Object} moduleBody
 * @returns {Promise<Module>}
 */
const createModule = async (moduleBody) => {
  return Module.create(moduleBody);
};

/**
 * Query for modules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModules = async (filter, options) => {
  const modules = await Module.paginate(filter, options);
  return modules;
};

/**
 * Get module by id
 * @param {ObjectId} id
 * @returns {Promise<Module>}
 */
const getModuleById = async (id) => {
  return Module.findById(id);
};

/**
 * Get module title by id
 * @param {ObjectId} id
 * @returns {Promise<Module>}
 */
const getModuleTitleById = async (id) => {
  return Module.findById(id).select('title');
};

// //Get all validated comments
// const getModulecomments = async (moduleId) =>{
//   const module = await Module.findById(moduleId).select('comments').$where('validated':true);
// }

/**
 * Update module by id
 * @param {ObjectId} moduleId
 * @param {Object} updateBody
 * @returns {Promise<Module>}
 */
const updateModuleById = async (moduleId, updateBody) => {
  const module = await getModuleById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  Object.assign(module, updateBody);
  await module.save();
  return module;
};

/**
 * Update module by id
 * @param {ObjectId} moduleId
 * @param {Object} updateBody
 * @returns {Promise<Module>}
 */
const updateModuleCommentsById = async (moduleId, updateBody) => {
  const moduleUpdated = await Module.findByIdAndUpdate({ _id: moduleId }, { $addToSet: { comments: updateBody } });
  if (!moduleUpdated) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  return moduleUpdated;
};

/**
 * Update module by id
 * @param {ObjectId} moduleId
 * @param {Object} updateBody
 * @returns {Promise<Module>}
 */
const updateModuleCommentReplyById = async (moduleId, updateBody) => {
  const module = await getModuleById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (module.comments) {
    module.comments.map((item) => {
      if (item.id === updateBody.commentId) {
        if (item.responses) {
          item.responses.push(updateBody.commentReply);
        } else {
          item.responses = [updateBody.commentReply];
        }
      }
    });
  }
  await module.save();
  return module;
};

/**
 * Delete module by id
 * @param {ObjectId} moduleId
 * @returns {Promise<Module>}
 */
const deleteModuleById = async (sectionId, moduleId) => {
  await Section.findByIdAndUpdate({ _id: sectionId }, { $pull: { modules: moduleId } });
  const module = await getModuleById(moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  await module.remove();
  return module;
};

//validate module comment
const validateModuleCommentById = async (moduleId, commentId) => {
  const module = await Module.findById({ _id: moduleId });
  if (module.comments) {
    module.comments.map((item) => {
      if (item.id === commentId) {
       item.validated = "true";
      }
    });
  }
  await module.save();
  return module;
};

//reject module comment
const closeModuleCommentById = async (moduleId, commentId) => {
  const module = await Module.findById({ _id: moduleId });
  if (module.comments) {
    module.comments.map((item) => {
      if (item.id === commentId) {
       item.validated = "false";
      }
    });
  }
  await module.save();
  return module;
};

module.exports = {
  createModule,
  queryModules,
  getModuleById,
  getModuleTitleById,
  updateModuleById,
  deleteModuleById,
  updateModuleCommentsById,
  updateModuleCommentReplyById,
  validateModuleCommentById,
  closeModuleCommentById

};
