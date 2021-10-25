export default [
  {
    path: '/setup/level',
    name: 'level-setup',
    component: () => import('@/views/modules/school-setup/level/LevelSetup.vue'),
    meta: {
      roles: ['admin'],
    },
  },
  {
    path: '/setup/class',
    name: 'class-setup',
    component: () => import('@/views/modules/school-setup/class/ClassSetup.vue'),
    meta: {
      roles: ['admin'],
    },
  },
  {
    path: '/setup/section',
    name: 'section-setup',
    component: () => import('@/views/modules/school-setup/section/SectionSetup.vue'),
    meta: {
      roles: ['admin'],
    },
  },
  {
    path: '/setup/subject',
    name: 'subject-setup',
    component: () => import('@/views/modules/school-setup/subject/SubjectSetup.vue'),
    meta: {
      roles: ['admin'],
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
      roles: ['admin'],
    },
  },
  {
    path: '/setup/news-and-event',
    name: 'news-and-event',
    component: () => import('@/views/modules/school-setup/news-and-event/Calendar.vue'),
    meta: {
      roles: ['admin'],
    },
  },
]
