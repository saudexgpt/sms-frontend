export default [
  {
    title: 'Materials',
    icon: 'BookIcon',
    acl: {
      modules: ['materials'],
      roles: ['teacher', 'student'],
    },
    children: [
      {
        title: 'Course',
        route: 'CourseMaterials',
        acl: {
          modules: ['materials'],
          roles: ['teacher'],
        },
      },
      {
        title: 'Lesson Plan',
        route: 'SubjectCurriculum',
        acl: {
          modules: ['materials'],
          roles: ['teacher'],
        },
      },
      {
        title: 'Course Materials',
        route: 'StudentCourseMaterials',
        acl: {
          modules: ['materials'],
          roles: ['student'],
        },
      },
      {
        title: 'Lesson Note',
        route: 'StudentSubjectCurriculum',
        acl: {
          modules: ['materials'],
          roles: ['student'],
        },
      },
    ],
  },
]
