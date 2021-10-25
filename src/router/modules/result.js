export default [
  {
    path: '/manage-grade',
    name: 'ManageGrade',
    component: () => import('@/views/modules/results/grades/ManageGrade.vue'),
    meta: {
      permissions: ['can configure grades'],
    },
  },
  {
    path: '/results/manage',
    name: 'ManageResult',
    component: () => import('@/views/modules/results/ManageResult.vue'),
    meta: {
      permissions: ['can manage results'],
    },
  },
  {
    path: '/manage-term-result/:class_teacher_id/:sess_id/:term_id/:sub_term',
    name: 'ManageTermResult',
    component: () => import('@/views/modules/results/partials/ManageTermResult.vue'),
    meta: {
      permissions: ['can manage results'],
    },
  },
  {
    path: '/broad-sheet-table/:class_teacher_id/:sess_id/:term_id/:sub_term',
    name: 'BroadSheetTable',
    component: () => import('@/views/modules/results/partials/BroadSheetTable.vue'),
    meta: {
      permissions: ['can manage results'],
    },
  },
  {
    path: '/student-result-details/:student_id/:class_teacher_id/:sess_id/:term_id/:sub_term',
    name: 'StudentResultDetails',
    component: () => import('@/views/modules/results/StudentResultDetails.vue'),
  },
  {
    path: '/record-result',
    name: 'RecordResult',
    component: () => import('@/views/modules/results/RecordResult.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/my-result',
    name: 'MyResult',
    component: () => import('@/views/modules/results/MyResult.vue'),
    meta: {
      roles: ['student'],
    },
  },
]
