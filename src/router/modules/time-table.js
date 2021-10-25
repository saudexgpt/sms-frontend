export default [
  {
    path: '/time-table/manage',
    name: 'ManageTimeTable',
    component: () => import('@/views/modules/time-table/index.vue'),
    meta: {
      permissions: ['can manage time-table'],
    },
  },
  {
    path: '/student/routine',
    name: 'StudentRoutine',
    component: () => import('@/views/modules/time-table/StudentRoutine.vue'),
    meta: {
      roles: ['student'],
    },
  },
  {
    path: '/teacher/routine',
    name: 'TeacherRoutine',
    component: () => import('@/views/modules/time-table/TeacherRoutine.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
]
