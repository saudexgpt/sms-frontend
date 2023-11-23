export default [
  {
    title: 'Time Table',
    icon: 'CalendarIcon',
    route: 'ManageTimeTable',
    // tag: '2',
    tagVariant: 'light-warning',
    acl: {
      modules: ['timetable'],
      roles: ['admin'],
      permissions: ['can manage time-table'],
    },
  },
  // {
  //   title: 'Time Table',
  //   icon: 'CalendarIcon',
  //   acl: {
  //     modules: ['timetable'],
  //     roles: ['admin'],
  //   },
  //   children: [
  //     {
  //       title: 'Manage',
  //       route: 'ManageTimeTable',
  //       acl: {
  //         modules: ['timetable'],
  //         permissions: ['can manage time-table'],
  //       },
  //     },
  //     {
  //       title: 'Class Routine',
  //       route: 'StudentRoutine',
  //       acl: {
  //         modules: ['timetable'],
  //         roles: ['student'],
  //       },
  //     },
  //     {
  //       title: 'My Routine',
  //       route: 'TeacherRoutine',
  //       acl: {
  //         modules: ['timetable'],
  //         roles: ['teacher'],
  //       },
  //     },
  //   ],
  // },
]
