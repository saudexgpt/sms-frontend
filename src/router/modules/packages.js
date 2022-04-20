export default [
  {
    path: '/manage-packages',
    name: 'ManagePakages',
    component: () => import('@/views/modules/packages/index.vue'),
    meta: {
      roles: ['super'],
    },
  },
]
