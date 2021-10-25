export default [
  // {
  //   header: 'Result Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Time Table',
    icon: 'CalendarIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   roles: ['admin'],
    // },
    children: [
      {
        title: 'Manage',
        route: 'ManageTimeTable',
        acl: {
          permissions: ['can manage time-table'],
        },
      },
      // {
      //   title: 'Record Result',
      //   route: 'RecordResult',
      // },
      {
        title: 'Class Routine',
        route: 'StudentRoutine',
        acl: {
          roles: ['student'],
        },
      },
      {
        title: 'My Routine',
        route: 'TeacherRoutine',
        acl: {
          roles: ['teacher'],
        },
      },
    ],
  },
]
