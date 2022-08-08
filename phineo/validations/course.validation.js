const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCourse = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string(),
    image: Joi.string(),
    teacher: Joi.string().required().custom(objectId),
    assignments: Joi.array(),
    sections: Joi.array(),
    responses: Joi.array(),
    comments: Joi.array(),
  }),
};

const getCourses = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    teacher: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      category: Joi.string(),
      image: Joi.string(),
      teacher: Joi.string(),
      assignments: Joi.array(),
      sections: Joi.array(),
      responses: Joi.array(),
      comments: Joi.array(),
    })
    .min(1),
};

const updateTeacher = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    teacher: Joi.required().custom(objectId),
  }),
};

const updateCourseSectionsOrder = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      sections: Joi.array(),
    })
    .min(1),
};

const updateCourseComments = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      knowledge: Joi.array(),
    })
    .min(1),
};

const deleteCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const deleteCourseComment = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
    commentId: Joi.string().custom(objectId),
  }),
};

const updateImage = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
};

const duplicateCourse = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
};

const createTag = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    tag: Joi.string().required(),
  }),
};

const getCourseTags = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
};

const addResponseUserInteraction = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  duplicateCourse,
  updateTeacher,
  updateCourseSectionsOrder,
  updateCourseComments,
  updateImage,
  deleteCourse,
  deleteCourseComment,
  addResponseUserInteraction,
  createTag,
  getCourseTags,
};
