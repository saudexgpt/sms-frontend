export default [
  {
    path: '/curriculum-level/group',
    name: 'curriculum-level-group',
    component: () => import('@/views/modules/app-setup/CurriculumLevelGroup.vue'),
    meta: {
      roles: ['super'],
    },
  },
  {
    path: '/curriculum-level/setup',
    name: 'curriculum-level-setup',
    component: () => import('@/views/modules/app-setup/CurriculumLevelSetup.vue'),
    meta: {
      roles: ['super'],
    },
  },
  {
    path: '/session',
    name: 'AcademicSession',
    component: () => import('@/views/modules/app-setup/AcademicSession.vue'),
    meta: {
      roles: ['super'],
    },
  },
]
