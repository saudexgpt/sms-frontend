export default [
  // {
  //   header: 'Result Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
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
        title: 'Configure Grades',
        route: 'ManageGrade',
        acl: {
          permissions: ['can configure grades'],
        },
      },
      {
        title: 'Manage Result',
        route: 'ManageResult',
        acl: {
          permissions: ['can manage results'],
        },
      },
      {
        title: 'Record Result',
        route: 'RecordResult',
        acl: {
          roles: ['teacher'],
        },
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
