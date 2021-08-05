export default [
  {
    path: '/level/setup',
    name: 'level-setup',
    component: () => import('@/views/modules/admin-settings/LevelSetup.vue'),
  },
  {
    path: '/class/setup',
    name: 'class-setup',
    component: () => import('@/views/modules/admin-settings/ClassSetup.vue'),
  },
]
