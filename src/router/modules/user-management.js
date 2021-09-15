export default [
  {
    path: '/manage-user/student',
    name: 'manage-student',
    component: () => import('@/views/modules/user/students/index.vue'),
  },
  {
    path: '/manage-user/staff',
    name: 'manage-staff',
    component: () => import('@/views/modules/user/staff/index.vue'),
  },
  {
    path: '/manage-user/parent',
    name: 'manage-parent',
    component: () => import('@/views/modules/user/parents/Parent.vue'),
  },
  {
    path: '/student-details/:id',
    component: () => import('@/views/modules/user/students/partials/Details.vue'),
    name: 'studentDetails',
    // meta: {
    //   title: 'Student Details',
    //   roles: ['commissioner', 'admin', 'principal', 'super_admin', 'teacher', 'student', 'parent'],

    // },
    // hidden: true,
  },
  {
    path: '/staff-details/:id',
    component: () => import('@/views/modules/user/staff/partials/Details.vue'),
    name: 'staffDetails',
  },
  {
    path: '/parent-details/:id',
    component: () => import('@/views/modules/user/parents/Details.vue'),
    name: 'guardiansDetails',
  },
]
