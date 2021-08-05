export default [
  {
    header: 'App Setup',
    acl: {
      roles: ['super'],
    },
  },
  {
    title: 'Setup',
    icon: 'ToolIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      roles: ['super'],
    },
    children: [
      {
        title: 'Curriculum Level',
        route: 'curriculum-level-setup',
      },
    ],
  },
]
