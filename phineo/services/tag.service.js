const httpStatus = require('http-status');
const axios = require('axios');
const { Tag } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const createTag = async (courseId, tagName) => {
  const tag = {
    courseId,
    tagName,
  };
  return Tag.create(tag);
};

const getCourseTagsById = async (courseId) => {
  const tags = await Tag.find({ courseId }).select('tagName');
  return tags;
};

module.exports = {
  createTag,
  getCourseTagsById,
};
