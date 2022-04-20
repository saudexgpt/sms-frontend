export default [
  {
    path: '/materials',
    name: 'CourseMaterials',
    component: () => import('@/views/modules/materials/CourseMaterials.vue'),
    meta: {
      roles: ['teacher'],
    },
  },

  {
    path: '/subject-curriculum',
    name: 'SubjectCurriculum',
    component: () => import('@/views/modules/materials/Curriculum.vue'),
    meta: {
      roles: ['teacher'],
    },
  },
  {
    path: '/student-materials',
    name: 'StudentCourseMaterials',
    component: () => import('@/views/modules/materials/StudentCourseMaterials.vue'),
    meta: {
      roles: ['student'],
    },
  },

  {
    path: '/student-subject-curriculum',
    name: 'StudentSubjectCurriculum',
    component: () => import('@/views/modules/materials/StudentCurriculum.vue'),
    meta: {
      roles: ['student'],
    },
  },
]
