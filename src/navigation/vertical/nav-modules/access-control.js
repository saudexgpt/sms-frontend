export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Access Control',
    icon: 'LockIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      roles: ['super', 'admin'],
    },
    children: [
      {
        title: 'Manage Roles',
        route: 'manage-roles',
        acl: {
          roles: ['admin'],
        },
      },
      // {
      //   title: 'Manage Permissions',
      //   route: 'manage-permissions',
      //   acl: {
      //     roles: ['super'],
      //   },
      // },
    ],
  },
]
