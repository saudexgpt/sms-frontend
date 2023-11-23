export default [
  {
    path: '/take-interview-test',
    name: 'Interview',
    component: () => import('@/views/modules/interview/index.vue'),
    meta: {
      roles: ['staff'],
    },
  },
  {
    path: '/manage-interview-test',
    name: 'ManageInterview',
    component: () => import('@/views/modules/interview/AdminDashboard.vue'),
    meta: {
      roles: ['staff'],
    },
  },
]
