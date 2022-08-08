const httpStatus = require('http-status');
const { Course, Message, User, InteractionMessage } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { getUserById } = require('./user.service');

/**
 * Create a course
 * @param {Object} courseBody
 * @returns {Promise<Course>}
 */
const createCourse = async (courseBody) => {
  const course = courseBody;
  return Course.create(course);
};

/**
 * Query for courses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 *
const queryCourses = async () => {
  const courses = await Course.find({ visible: { $eq: true } }).populate('teacher');
  return courses;
};

*/

const queryCourses = async (filter, options) => {
  let filterFull = {};
  if (Object.keys(filter).length === 0) {
    filterFull = { visible: true };
  } else {
    filterFull = { $and: [{ visible: true }, filter] };
  }

  const courses = await Course.find(filterFull).populate('teacher');
  return courses;
};

/**
 * Get course by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getCourseById = async (id) => {
  const course = await Course.findById(id).populate('teacher');
  return course;
};

/**
 * Get course by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getCourseToDuplicateById = async (id) => {
  const course = await Course.findById(id).select(
    '_id category sections interactions title description image teacher knowledge visible'
  );
  return course;
};

/**
 * Get only course by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getOnlyCourseById = async (id) => {
  const course = await Course.findById(id);
  return course;
};

/**
 * Get course with sections by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getFullCourseById = async (courseId, userId, userRole) => {
  const user = await getUserById(userId);
  const course = await Course.findById(courseId)
    .populate({ path: 'sections', populate: { path: 'modules' } })
    .populate({ path: 'responses', match: { progress: { $gt: 0 } }, select: 'userId modulesResponse' })
    .populate({ path: 'assignments', populate: { path: 'user' } });
  if (
    user &&
    course &&
    user.courses.find((item) => item == course._id) &&
    user.courses.find((item) => item == course.id) &&
    course.teacher != userId &&
    userRole != 'admin' &&
    userRole != 'emrys' &&
    userRole != 'user'
  ) {
    // if (course && course.teacherId != userId && !course.assignments.include(userId) && userRole != "admin") {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found A');
  }
  return course;
};

/**
 * Update course by id
 * @param {ObjectId} courseId
 * @param {Object} updateBody
 * @returns {Promise<Course>}
 */
const updateCourseById = async (courseId, updateBody) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  Object.assign(course, updateBody);
  await course.save();
  return course;
};

/**
 * Update course comments by id
 * @param {ObjectId} courseId
 * @param {Object} updateBody
 * @returns {Promise<Course>}
 */
const updateCourseCommentsById = async (courseId, updateBody) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  Object.assign(course, updateBody);
  await course.save();
  return course;
};

/**
 * Delete course comments by id
 * @param {ObjectId} courseId
 * @returns {Promise<Course>}
 */
const deleteCourseCommentsById = async (courseId, commentId) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  for (i = 0; i < course.knowledge.length; i++) {
    if (course.knowledge[i]._id == commentId) {
      course.knowledge.splice(i, 1);
    }
  }

  await course.save();
  return course;
};

/**
 * Update course section by id
 * @param {ObjectId} courseId
 * @param {ObjectId} sectionId
 * @returns {Promise<Course>}
 */
const updateCourseSectionById = async (courseId, sectionId) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  // Object.assign(course, updateBody);
  course.sections.push(sectionId);
  await course.save();
  return course;
};

/**
 * Delete course by id
 * @param {ObjectId} courseId
 * @returns {Promise<Course>}
 */
const deleteCourseById = async (courseId) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const visibleBody = {
    visible: false,
  };

  Object.assign(course, visibleBody);
  await course.save();
  return course;
};

const getUsersCoursesById = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'courses',
    select: 'category description id image teacher title assignments',
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // OPTIMISATION : CHANGER LA REQUETE DU DESSUS PERMETTANT DE RECUP UNIQUEMENT LES ASSIGNMENTS AVEC L'ID DE L'USER
  for (a = 0; a < user.courses.length; a++) {
    for (i = 0; i < user.courses[a].assignments.length; i++) {
      if (user.courses[a].assignments[i].user == userId) {
        user.courses[a].assignments.push(user.courses[a].assignments[i]);
        user.courses[a].assignments.splice(0, user.courses[a].assignments.length - 1);
      }
    }
  }

  return user.courses;
};

/**
 * Get course with sections by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getPhineoCourseById = async (courseId, userId, userRole) => {
  const user = await getUserById(userId);
  const course = await Course.findById(
    courseId,
    'title category description knowledge id image teacher interactions assignments'
  )
    .populate({ path: 'sections', populate: { path: 'modules', select: 'title accessConditions' } })
    .populate({ path: 'responses', match: { userId: { $eq: userId } }, populate: { path: 'modulesResponse' } });

  // OPTIMISATION : CHANGER LA REQUETE DU DESSUS PERMETTANT DE RECUP UNIQUEMENT LES ASSIGNMENTS AVEC L'ID DE L'USER
  for (i = 0; i < course.assignments.length; i++) {
    if (course.assignments[i].user == userId) {
      course.assignments.push(course.assignments[i]);
      course.assignments.splice(0, course.assignments.length - 1);
    }
  }

  if (
    user &&
    course &&
    user.courses.find((item) => item == course._id) &&
    user.courses.find((item) => item == course.id) &&
    course.teacher != userId &&
    userRole != 'admin'
  ) {
    // if (course && course.teacherId != userId && !course.assignments.include(userId) && userRole != "admin") {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found P');
  }
  return course;
};

const updateCourseImageById = async (imageUrl, courseId) => {
  const course = updateCourseById(courseId, { image: imageUrl });
  return course;
};

const getCoursesTeacher = async (userCourses) => {
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
    $and: [{ _id: { $in: userCourses } }, { _id: { $nin: coursesToAvoid } }, { visible: true }],
  })
    .select('title')
    .populate({ path: 'teacher', select: 'firstName lastName' });
  return courses;
};

const getOneCourseTeacher = async (courseId) => {
  const course = await Course.findById(courseId).select('title').populate({ path: 'teacher', select: 'firstName lastName' });
  return course;
};

const getMessagesInteraction = async (courseId, userId) => {
  const currentDate = new Date();
  const messages = await Message.find({ userId, courseId, serverDate: { $lt: currentDate } })
    .select('message nodeType nodeId serverDate displayDate interractionId')
    .sort({ serverDate: 1 });
  if (messages.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Interaction Messages Found');
  }

  if (messages[messages.length - 1].nodeType === 'QuestionType') {
    const interraction = await InteractionMessage.findById(messages[messages.length - 1].interractionId);
    const responses = [];

    for (let i = 0; i < interraction.content.edges.length; i++) {
      if (interraction.content.edges[i].source === messages[messages.length - 1].nodeId) {
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
    messages.push(responses);
  }

  return messages;
};

const removeAssignment = async (data) => {
  const course = await getOnlyCourseById(data.courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  for (i = 0; i < course.assignments.length; i++) {
    if (course.assignments[i].user == data.userId) {
      course.assignments.splice(i, 1);
    }
  }

  await course.save();

  const courseFinal = await Course.findById(data.courseId).populate({ path: 'assignments', populate: { path: 'user' } });
  return courseFinal;
};

module.exports = {
  createCourse,
  queryCourses,
  getCourseById,
  getOnlyCourseById,
  getFullCourseById,
  getPhineoCourseById,
  updateCourseById,
  updateCourseSectionById,
  updateCourseCommentsById,
  deleteCourseById,
  getUsersCoursesById,
  deleteCourseCommentsById,
  updateCourseImageById,
  getCoursesTeacher,
  getMessagesInteraction,
  getOneCourseTeacher,
  removeAssignment,
  getCourseToDuplicateById,
};
