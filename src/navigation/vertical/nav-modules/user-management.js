export default [
  // {
  //   header: 'User Management',
  //   acl: {
  //     roles: ['admin'],
  //   },
  // },
  {
    title: 'Manage Users',
    icon: 'UsersIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      permissions: ['can company manage staff', 'can manage staff', 'can manage student'],
    },
    children: [
      {
        title: 'Company Staff',
        route: 'manage-company-staff',
        acl: {
          permissions: ['can company manage staff'],
        },
      },
      {
        title: 'Manage Student',
        route: 'manage-student',
        acl: {
          permissions: ['can manage student'],
        },
      },
      {
        title: 'Manage Staff',
        route: 'manage-staff',
        acl: {
          permissions: ['can manage staff'],
        },
      },
      {
        title: 'Manage Parent',
        route: 'manage-parent',
        acl: {
          permissions: ['can manage student'],
        },
      },
    ],
  },
]
