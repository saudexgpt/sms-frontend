export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Assignment',
    icon: 'BookIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   roles: ['admin'],
    // },
    children: [
      {
        title: 'All Assignments',
        route: 'AllAssignments',
        acl: {
          roles: ['admin'],
        },
      },
      {
        title: 'Add Assignment',
        route: 'AddAssignment',
        acl: {
          roles: ['teacher'],
        },
      },
      {
        title: 'View Assignments',
        route: 'ViewAssignments',
        acl: {
          roles: ['teacher'],
        },
      },
      {
        title: 'My Assignment',
        route: 'StudentAssignment',
        acl: {
          roles: ['student'],
        },
      },
    ],
  },
]
