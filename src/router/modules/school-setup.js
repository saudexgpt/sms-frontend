export default [
  {
    path: '/setup/level',
    name: 'level-setup',
    component: () => import('@/views/modules/school-setup/level/LevelSetup.vue'),
  },
  {
    path: '/setup/class',
    name: 'class-setup',
    component: () => import('@/views/modules/school-setup/class/ClassSetup.vue'),
  },
  {
    path: '/setup/section',
    name: 'section-setup',
    component: () => import('@/views/modules/school-setup/section/SectionSetup.vue'),
  },
  {
    path: '/setup/subject',
    name: 'subject-setup',
    component: () => import('@/views/modules/school-setup/subject/SubjectSetup.vue'),
  },
  {
    path: '/setup/session-and-term',
    name: 'session-and-term',
    component: () => import('@/views/modules/school-setup/session-and-term/index.vue'),
  },
  {
    path: '/setup/news-and-event',
    name: 'news-and-event',
    component: () => import('@/views/modules/school-setup/news-and-event/Calendar.vue'),
  },
]
