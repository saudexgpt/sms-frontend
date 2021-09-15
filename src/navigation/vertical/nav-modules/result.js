export default [
  {
    header: 'Result Module',
    // acl: {
    //   roles: ['admin'],
    // },
  },
  {
    title: 'Result',
    icon: 'FileTextIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   roles: ['admin'],
    // },
    children: [
      {
        title: 'Manage Result',
        route: 'ManageResult',
      },
      {
        title: 'Record Result',
        route: 'RecordResult',
      },
      {
        title: 'My Result',
        route: 'MyResult',
        acl: {
          roles: ['student'],
        },
      },
    ],
  },
]
