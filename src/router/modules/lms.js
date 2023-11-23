export default [
  // {
  //   path: '/lms/vle',
  //   name: 'VirtualLearning',
  //   component: () => import('@/views/modules/lms/VirtualLearning.vue'),
  //   meta: {
  //     roles: ['teacher'],
  //   },
  // },
  {
    path: '/lms/e-exam',
    name: 'EExam',
    component: () => import('@/views/modules/lms/exams/TeacherQuizDashboard.vue'),
    meta: {
      roles: ['teacher'],
    },
  },

  {
    path: '/lms/set-questions',
    name: 'SetQuestions',
    component: () => import('@/views/modules/lms/exams/SetQuestions.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/lms/e-exam',
    name: 'EExam',
    component: () => import('@/views/modules/lms/exams/AdminQuizDashboard.vue'),
    meta: {
      roles: ['admin'],
    },
  },
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
  {
    path: '/lms/classroom',
    name: 'Classroom',
    component: () => import('@/views/modules/lms/classes/TeacherClassDashboard.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/lms/classroom',
    name: 'Classroom',
    component: () => import('@/views/modules/lms/classes/AdminClassDashboard.vue'),
    meta: {
      roles: ['admin'],
    },
  },
]
