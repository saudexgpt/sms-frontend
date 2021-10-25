export default [
  // {
  //   header: 'School Setup',
  //   acl: {
  //     roles: ['admin'],
  //   },
  // },
  {
    title: 'Setup',
    icon: 'SettingsIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      permissions: ['can manage settings'],
    },
    children: [
      {
        title: 'Manage Level',
        route: 'level-setup',
      },
      {
        title: 'Manage Section',
        route: 'section-setup',
      },
      {
        title: 'Manage Class',
        route: 'class-setup',
      },
      {
        title: 'Manage Subject',
        route: 'subject-setup',
      },
      {
        title: 'Session & Term',
        route: 'session-and-term',
      },
      {
        title: 'News & Event',
        route: 'news-and-event',
      },
    ],
  },
]
