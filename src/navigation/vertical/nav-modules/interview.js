export default [
  {
    title: 'Interview CBT',
    icon: 'EditIcon',
    acl: {
      modules: ['lms'],
      roles: ['admin', 'teacher'],
    },
    children: [
      {
        title: 'Take Test ',
        route: 'Interview',
        acl: {
          modules: ['lms'],
          roles: ['staff'],
        },
        // tag: '2',
        // tagVariant: 'light-warning',
      },
      {
        title: 'Manage Test',
        route: 'ManageInterview',
        acl: {
          modules: ['lms'],
          roles: ['admin'],
        },
      },
    ],
  },
]
