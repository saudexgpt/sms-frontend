export default [
  {
    path: '/attendance/class',
    name: 'ClassAttendance',
    component: () => import('@/views/modules/attendance/ClassAttendance.vue'),
    meta: {
      permissions: ['can view class attendance'],
    },
  },
  // {
  //   path: '/attendance/student',
  //   name: 'ClassAttendance',
  //   component: () => import('@/views/modules/attendance/ClassAttendance.vue'),
  //   meta: {
  //     roles: ['student'],
  //   },
  // },
  {
    path: '/attendance/subject',
    name: 'SubjectAttendance',
    component: () => import('@/views/modules/attendance/SubjectAttendance.vue'),
    meta: {
      permissions: ['can view subject attendance'],
    },
  },
]
