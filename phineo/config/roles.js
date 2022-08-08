const allRoles = {
  user: ['manageCourses','getCourses', 'notification', 'getInteractions', 'manageInteractions', 'user'],
  emrys: ['getCourses', 'notification', 'getInteractions', 'manageInteractions', 'user', 'emrys'],
  teacher: [
    'getUsers',
    'manageUsers',
    'createCourses',
    'getCourses',
    'manageCourses',
    'createInteractions',
    'manageInteractions',
    'getInteractions',
    'notification',
    'getAnalytics',
    'user',
    'emrys',
    'teacher',
  ],
  admin: [
    'user',
    'emrys',
    'teacher',
    'admin',
    'getUsers',
    'manageUsers',
    'createCourses',
    'getCourses',
    'manageCourses',
    'createInteractions',
    'manageInteractions',
    'getInteractions',
    'getAnalytics',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
