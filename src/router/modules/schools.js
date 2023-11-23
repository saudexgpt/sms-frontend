export default [
  {
    path: '/schools/manage',
    name: 'schools',
    component: () => import('@/views/modules/schools/index.vue'),
    meta: {
      permissions: ['can manage schools', 'can view all schools'],
    },
  },
  {
    path: '/schools/my-schools',
    name: 'my-schools',
    component: () => import('@/views/modules/schools/MySchool.vue'),
    meta: {
      permissions: ['can register schools'],
    },
  },
  {
    path: '/schools/details/:id',
    name: 'schoolDetails',
    component: () => import('@/views/modules/schools/Details.vue'),
    meta: {
      permissions: ['can manage schools', 'can register schools'],
    },
  },
  {
    hidden: true,
    path: '/schools/register',
    name: 'register-schools',
    component: () => import('@/views/pages/authentication/RegisterSchool.vue'),
    meta: {
      permissions: ['can register schools', 'can manage schools'],
    },
  },
  {
    hidden: true,
    path: '/schools/proposal',
    name: 'proposal',
    component: () => import('@/views/modules/schools/Proposal.vue'),
  },
  {
    path: '/account/suspended',
    name: 'account-suspended',
    component: () => import('@/views/modules/schools/AccountSuspended.vue'),
  },
]
