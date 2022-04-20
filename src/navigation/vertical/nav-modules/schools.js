export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Manage Schools',
    icon: 'TrelloIcon',
    route: 'schools',
    acl: {
      permissions: ['can manage schools'],
    },
  },
]
