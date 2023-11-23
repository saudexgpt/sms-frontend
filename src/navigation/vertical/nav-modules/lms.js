export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Academics',
    icon: 'AirplayIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   except: ['super', 'parent', 'librarian'],
    // },
    acl: {
      modules: ['lms'],
      roles: ['admin', 'teacher', 'student'],
    },
    children: [
      {
        title: 'Classroom',
        route: 'Classroom',
        acl: {
          modules: ['lms'],
          roles: ['teacher', 'admin'],
        },
      },
      {
        title: 'Examination',
        route: 'EExam',
        acl: {
          modules: ['lms'],
          roles: ['teacher', 'admin'],
        },
      },
      {
        title: 'My Classroom',
        route: 'StudentClassroom',
        acl: {
          modules: ['lms'],
          roles: ['student'],
        },
      },
      {
        title: 'My Examination',
        route: 'StudentExam',
        acl: {
          modules: ['lms'],
          roles: ['student'],
        },
      },
    ],
  },
]
