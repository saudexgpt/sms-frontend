export default [
  {
    path: '/manage-user/student',
    name: 'manage-student',
    component: () => import('@/views/modules/user/students/index.vue'),
    meta: {
      permissions: ['can manage student'],
    },
  },
  {
    path: '/manage-user/staff',
    name: 'manage-staff',
    component: () => import('@/views/modules/user/staff/index.vue'),
    meta: {
      permissions: ['can manage staff'],
    },
  },
  {
    path: '/manage-company-staff',
    name: 'manage-company-staff',
    component: () => import('@/views/modules/user/staff/Partners.vue'),
    meta: {
      permissions: ['can manage company staff'],
    },
  },
  {
    path: '/manage-user/parent',
    name: 'manage-parent',
    component: () => import('@/views/modules/user/parents/Parent.vue'),
    meta: {
      permissions: ['can manage student'],
    },
  },
  {
    path: '/student-details/:id',
    component: () => import('@/views/modules/user/students/partials/Details.vue'),
    name: 'studentDetails',
    // meta: {
    //   permissions: ['can manage student'],
    // },
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
    // meta: {
    //   permissions: ['can manage staff'],
    // },
  },
  {
    path: '/parent-details/:id',
    component: () => import('@/views/modules/user/parents/Details.vue'),
    name: 'guardiansDetails',
    meta: {
      permissions: ['can manage student'],
    },
  },
  {
    path: '/profile',
    component: () => import('@/views/modules/user/Profile.vue'),
    name: 'UserProfile',
  },
  {

    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/modules/Notifications.vue'),
  },
]
