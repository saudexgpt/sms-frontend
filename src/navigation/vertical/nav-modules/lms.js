export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'E-Learning',
    icon: 'AirplayIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   roles: ['admin'],
    // },
    children: [
      {
        title: 'Student Exam',
        route: 'StudentExam',
        acl: {
          roles: ['student'],
        },
      },
      {
        title: 'Class Room',
        route: 'StudentClassroom',
        acl: {
          roles: ['student'],
        },
      },
    ],
  },
]
