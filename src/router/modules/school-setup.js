export default [
  {
    path: '/setup/level',
    name: 'level-setup',
    component: () => import('@/views/modules/school-setup/level/LevelSetup.vue'),
    meta: {
      permissions: ['can manage settings'],
    },
  },
  {
    path: '/setup/class',
    name: 'class-setup',
    component: () => import('@/views/modules/school-setup/class/ClassSetup.vue'),
    meta: {
      permissions: ['can manage settings'],
    },
  },
  {
    path: '/setup/section',
    name: 'section-setup',
    component: () => import('@/views/modules/school-setup/section/SectionSetup.vue'),
    meta: {
      permissions: ['can manage settings'],
    },
  },
  {
    path: '/setup/subject',
    name: 'subject-setup',
    component: () => import('@/views/modules/school-setup/subject/SubjectSetup.vue'),
    meta: {
      permissions: ['can manage settings', 'can manage subjects'],
    },
  },
  {
    path: '/teacher/subjects',
    name: 'TeacherSubjects',
    component: () => import('@/views/modules/school-setup/subject/TeacherSubjects.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/subject-students/:id',
    component: () => import('@/views/modules/school-setup/subject/SubjectStudents.vue'),
    name: 'SubjectStudents',
    meta: {
      roles: ['teacher'],

    },
  },
  {
    path: '/teacher/classes',
    name: 'TeacherClasses',
    component: () => import('@/views/modules/school-setup/class/TeacherClasses.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/setup/session-and-term',
    name: 'session-and-term',
    component: () => import('@/views/modules/school-setup/session-and-term/index.vue'),
    meta: {
      permissions: ['can manage settings'],
    },
  },
  {
    path: '/registration-pins',
    name: 'registration-pins',
    component: () => import('@/views/modules/school-setup/registration-pins/index.vue'),
    meta: {
      permissions: ['can manage registration pins'],
    },
  },
]
