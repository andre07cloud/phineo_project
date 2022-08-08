/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const multer = require('multer');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  courseService,
  interactionMessageService,
  sectionService,
  moduleService,
  interactionService,
  tagService,
} = require('../services');
const { Course } = require('../models');

const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  res.status(httpStatus.CREATED).send(course);
});

const getCourses = catchAsync(async (req, res) => {
  if (req.user.role === 'teacher') {
    req.query.teacher = req.user.id;
  }
  const filter = pick(req.query, ['teacher', 'assignments']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await courseService.queryCourses(filter, options, req.user.id);
  res.send(result);
});

const getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  res.send(course);
});

const getFullCourse = catchAsync(async (req, res) => {
  const course = await courseService.getFullCourseById(req.params.courseId, req.user.id, req.user.role);
  console.log(req.user);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  res.send(course);
});

const getPhineoCourse = catchAsync(async (req, res) => {
  const course = await courseService.getPhineoCourseById(req.params.courseId, req.user.id, req.user.role);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  res.send(course);
});

const updateCourse = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseById(req.params.courseId, req.body);
  res.send(course);
});

const updateCourseComments = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseCommentsById(req.params.courseId, req.body);
  res.send(course);
});

const deleteCourseComment = catchAsync(async (req, res) => {
  await courseService.deleteCourseCommentsById(req.params.courseId, req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUsersCourses = catchAsync(async (req, res) => {
  const result = await courseService.getUsersCoursesById(req.params.userId);
  res.send(result);
});

const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourseById(req.params.courseId);
  res.status(httpStatus.OK).send();
});

const updateImage = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseImageById(req.body.imageUrl, req.body.courseId);
  res.send(course);
});

const getCoursesForInteraction = catchAsync(async (req, res) => {
  const courses = await courseService.getCoursesTeacher(req.user.courses);
  res.send(courses);
});

const getCourseDetailForInteraction = catchAsync(async (req, res) => {
  const course = await courseService.getOneCourseTeacher(req.params.courseId);
  res.send(course);
});

const getInteractionUser = catchAsync(async (req, res) => {
  const messages = await courseService.getMessagesInteraction(req.params.courseId, req.params.userId);
  res.send(messages);
});

const getInteractionUserSuitAfterPersonalizedMessage = catchAsync(async (req, res) => {
  const createPersonalizedMessage = await interactionMessageService.createPersonalizedMessageAtRestart(
    req.params.userId,
    req.params.courseId,
    req.body.interactionId,
    req.body.data.nodeId
  );

  const response = await interactionMessageService.returnTheSuitOfInteraction(
    req.params.userId,
    req.params.courseId,
    req.body.data.nodeId,
    req.body.interactionId
  );

  res.send(response);
});

const getInteractionUserSuit = catchAsync(async (req, res) => {
  const response = await interactionMessageService.returnTheSuitOfInteraction(
    req.params.userId,
    req.params.courseId,
    req.body.data.nodeId,
    req.body.interactionId
  );
  res.send(response);
});

const addResponseUserInteraction = catchAsync(async (req, res) => {
  const createAnswerMessage = await interactionMessageService.createUserAnswerMessage(
    req.params.userId,
    req.params.courseId,
    req.body.data,
    req.body.interactionId
  );
  const response = await interactionMessageService.returnTheSuitOfInteraction(
    req.params.userId,
    req.params.courseId,
    req.body.data.id,
    req.body.interactionId
  );
  res.send(response);
});

const updateCourseTeacher = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseById(req.params.courseId, req.body);
  res.send(course);
});

const duplicateCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseToDuplicateById(req.body.courseId);

  const sections = [];
  let modules = [];
  const interactions = [];

  for (let sectionNb = 0; sectionNb < course.sections.length; sectionNb++) {
    const section = await sectionService.getSectionById(course.sections[sectionNb]);
    for (let moduleNb = 0; moduleNb < section.modules.length; moduleNb++) {
      const module = await moduleService.getModuleById(section.modules[moduleNb]);

      if (module) {
        const moduleToDuplicate = {
          description: module.description,
          conditions: module.conditions,
          accessConditions: module.accessConditions,
          title: module.title,
          type: module.type,
          filePath: module.filePath,
          content: module.content,
          comments: module.comments,
        };

        const newModule = await moduleService.createModule(moduleToDuplicate);
        modules.push(newModule._id);
      }
    }

    const sectionToDuplicate = {
      modules,
      title: section.title,
      description: section.description,
    };

    const newSection = await sectionService.createSection(sectionToDuplicate);
    sections.push(newSection._id);
    modules = [];
  }

  for (let interactionNb = 0; interactionNb < course.interactions.length; interactionNb++) {
    const interaction = await interactionMessageService.getInteractionMessageById(course.interactions[interactionNb]);
    const interactionToDuplicate = {
      daysAfter: interaction.daysAfter,
      hourOfTheDay: interaction.hourOfTheDay,
      minuteOfTheDay: interaction.minuteOfTheDay,
      begin: interaction.begin,
      finished: interaction.finished,
      title: interaction.title,
      content: interaction.content,
    };

    const newInteraction = await interactionMessageService.onlyCreateInteractionMessage(interactionToDuplicate);
    interactions.push(newInteraction._id);
  }

  const CourseToDuplicate = {
    category: course.category,
    interactions,
    sections,
    title: `${course.title} - copie`,
    description: course.description,
    image: course.image,
    teacher: course.teacher,
    knowledge: course.knowledge,
    visible: course.visible,
  };

  const newCourse = await courseService.createCourse(CourseToDuplicate);
  res.send(newCourse);
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  getFullCourse,
  getPhineoCourse,
  updateCourse,
  updateCourseComments,
  deleteCourse,
  getUsersCourses,
  deleteCourseComment,
  updateImage,
  getCoursesForInteraction,
  getInteractionUser,
  getCourseDetailForInteraction,
  addResponseUserInteraction,
  updateCourseTeacher,
  getInteractionUserSuit,
  duplicateCourse,
  getInteractionUserSuitAfterPersonalizedMessage,
};
