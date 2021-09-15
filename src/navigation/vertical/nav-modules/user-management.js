export default [
  {
    header: 'User Management',
    acl: {
      roles: ['admin'],
    },
  },
  {
    title: 'Manage Users',
    icon: 'UsersIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      roles: ['admin'],
    },
    children: [
      {
        title: 'Manage Student',
        route: 'manage-student',
      },
      {
        title: 'Manage Staff',
        route: 'manage-staff',
      },
      {
        title: 'Manage Parent',
        route: 'manage-parent',
      },
    ],
  },
]
