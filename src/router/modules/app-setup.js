export default [
  {
    path: '/curriculum-level/group',
    name: 'curriculum-level-group',
    component: () => import('@/views/modules/app-setup/CurriculumLevelGroup.vue'),
  },
  {
    path: '/curriculum-level/setup',
    name: 'curriculum-level-setup',
    component: () => import('@/views/modules/app-setup/CurriculumLevelSetup.vue'),
  },
]
