export default [
  {
    path: '/lms/student-exam',
    name: 'StudentExam',
    component: () => import('@/views/modules/lms/exams/StudentSubjectExams.vue'),
    meta: {
      roles: ['student'],
    },
  },
  {
    path: '/lms/student-classroom',
    name: 'StudentClassroom',
    component: () => import('@/views/modules/lms/classes/StudentClassDashboard.vue'),
    meta: {
      roles: ['student'],
    },
  },
]
