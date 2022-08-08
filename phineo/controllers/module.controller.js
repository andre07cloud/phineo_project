const httpStatus = require('http-status');
const HTMLDecoderEncoder = require('html-encoder-decoder');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { moduleService, sectionService, logService } = require('../services');
const { Module } = require('../models');

const createModule = catchAsync(async (req, res) => {
  const module = await moduleService.createModule(req.body);
  const section = await sectionService.updateSectionModuleById(req.params.sectionId, module.id);
  res.status(httpStatus.CREATED).send(module);
});

const getModules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ids']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await moduleService.queryModules(filter, options);
  res.send(result);
});

const getModule = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (module.content) {
    module.content = HTMLDecoderEncoder.decode(module.content);
  }
  if (module.description) {
    module.description = HTMLDecoderEncoder.decode(module.description);
  }
  res.send(module);
});

const getModuleComments = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  let comments = [];
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (module.comments) {
    comments = module.comments;
  }
  res.send(comments);
});

//Get all unValidated comments
const getAllComments = catchAsync(async (req, res) => {
  const modules = await Module.find().select('comments');
  let commentslist = [];
  let commentInside = [];
 //console.log(modules);
  modules.map((item) => {
    //console.log(item);
    //console.log(item.validated);
    
      commentslist.push(item);
    
    // item.map((item2) => {
    //   console.log(item2.validated);
    // })
    
  });
  commentslist.map((item) => {
     console.log(item.comments);
     commentInside.push(item);
  });
  for(const elt in commentslist){
    //console.log(elt.length);
  }
  res.send(commentslist);
});

//Get validated comments
const getValidatedModuleComments = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  var commentValidated = [];
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (module.comments) {
    module.comments.map((item) =>{
      
      if(item.validated == true){
        commentValidated.push(item);
      }
    })
  }
  res.send(commentValidated);
});

//Get user validated comments
const getUserdModuleComments = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  const userId = req.params.userId;
  var userComments = [];
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (module.comments) {
    module.comments.map((item) =>{
      
      if(item.validated == true && item.userId == userId){
        userComments.push(item);
      }
    })
  }
  res.send(userComments);
});

//Get unValidated comments
const getUnValidatedModuleComments = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId);
  var unValidated = [];
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (module.comments) {
    module.comments.map((item) =>{
      
      if(item.validated == false){
        unValidated.push(item);
      }
    })
  }
  res.send(unValidated);
});

const updateModule = catchAsync(async (req, res) => {
  const module = await moduleService.updateModuleById(req.params.moduleId, req.body);
  res.send(module);
});

const updateModuleComments = catchAsync(async (req, res) => {
  const module = await moduleService.updateModuleCommentsById(req.params.moduleId, req.body);
  res.send(module);
});

const updateModuleCommentReply = catchAsync(async (req, res) => {
  const module = await moduleService.updateModuleCommentReplyById(req.params.moduleId, req.body);
  res.send(module);
});

const deleteModule = catchAsync(async (req, res) => {
  await moduleService.deleteModuleById(req.params.sectionId, req.params.moduleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getModuleTitle = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleTitleById(req.params.moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  res.send(module);
});
//validate Comment
const validateModuleComment = catchAsync(async (req, res) => {
 const moduleUpdated = await moduleService.validateModuleCommentById(req.params.moduleId, req.params.commentId);
 res.send(moduleUpdated);
});

//close Comment
const closeModuleComment = catchAsync(async (req, res) => {
  const moduleUpdated = await moduleService.closeModuleCommentById(req.params.moduleId, req.params.commentId);
  res.send(moduleUpdated);
 });

module.exports = {
  createModule,
  getModules,
  getModule,
  getModuleTitle,
  updateModule,
  deleteModule,
  getModuleComments,
  updateModuleComments,
  updateModuleCommentReply,
  validateModuleComment,
  closeModuleComment,
  getValidatedModuleComments,
  getUnValidatedModuleComments,
  getUserdModuleComments,
  getAllComments
};
