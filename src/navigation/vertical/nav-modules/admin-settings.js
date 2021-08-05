export default [
  {
    header: 'Admin Settings',
    acl: {
      roles: ['admin'],
    },
  },
  {
    title: 'Settings',
    icon: 'SettingsIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      roles: ['admin'],
    },
    children: [
      {
        title: 'Level',
        route: 'level-setup',
      },
      {
        title: 'Class',
        route: 'class-setup',
      },
    ],
  },
]
