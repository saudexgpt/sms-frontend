export default [
  {
    path: '/assignment/all',
    name: 'AllAssignments',
    component: () => import('@/views/modules/assignment/AllAssignments.vue'),
    meta: {
      roles: ['admin'],
    },
  },
  {
    path: '/assignment/add',
    name: 'AddAssignment',
    component: () => import('@/views/modules/assignment/AddAssignment.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/assignment/view',
    name: 'ViewAssignments',
    component: () => import('@/views/modules/assignment/ViewAssignments.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/student/assignment',
    name: 'StudentAssignment',
    component: () => import('@/views/modules/assignment/StudentAssignment.vue'),
    meta: {
      roles: ['student'],
    },
  },
]
