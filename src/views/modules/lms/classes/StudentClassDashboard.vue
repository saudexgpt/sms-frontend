<template>
  <el-card>
    <b-tabs
      pills
      content-class="mt-1"
    >
      <!-- This tabs content will always be mounted -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="MonitorIcon" />
          <span>Online Class</span>
        </template>
        <student-routine />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="EditIcon" />
          <span>Assignments</span>
        </template>
        <student-assignment />
      </b-tab>
      <!-- This tabs content will not be mounted until the tab is shown -->
      <!-- and will be un-mounted when hidden -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="BookIcon" />
          <span>Materials</span>
        </template>
        <course-materials />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="FileTextIcon" />
          <span>Lesson Plan</span>
        </template>
        <lesson-plan />
      </b-tab>
      <!-- <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="TrendingUpIcon" />
          <span>Progress</span>
        </template>
        Sanguine
      </b-tab> -->
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import StudentRoutine from '@/views/modules/time-table/StudentRoutine.vue'
import CourseMaterials from '@/views/modules/materials/StudentCourseMaterials.vue'
import StudentAssignment from '@/views/modules/assignment/StudentAssignment.vue'
import LessonPlan from '@/views/modules/materials/StudentCurriculum.vue'

export default {
  components: {
    BTabs,
    BTab,
    StudentRoutine,
    CourseMaterials,
    StudentAssignment,
    LessonPlan,
  },
}
</script>
