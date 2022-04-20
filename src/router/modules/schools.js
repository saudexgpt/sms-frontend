export default [
  {
    path: '/schools/manage',
    name: 'schools',
    component: () => import('@/views/modules/schools/index.vue'),
    meta: {
      permissions: ['can manage schools'],
    },
  },
  {
    path: '/schools/details/:id',
    name: 'schoolDetails',
    component: () => import('@/views/modules/schools/Details.vue'),
    meta: {
      permissions: ['can manage schools'],
    },
  },
]
