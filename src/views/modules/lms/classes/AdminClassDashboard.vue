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
        <teacher-routine view-type="online_class" />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UserCheckIcon" />
          <span>Attendance</span>
        </template>
        <b-tabs
          content-class="mt-1"
        >
          <b-tab lazy>
            <template #title>
              <span>Class</span>
            </template>
            <class-attendance />
          </b-tab>
          <b-tab lazy>
            <template #title>
              <span>Subject</span>
            </template>
            <subject-attendance />
          </b-tab>
        </b-tabs>
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="EditIcon" />
          <span>Assignments</span>
        </template>
        <b-tabs
          content-class="mt-1"
        >
          <b-tab lazy>
            <template #title>
              <feather-icon icon="EyeIcon" />
              <span>View</span>
            </template>
            <view-assignments />
          </b-tab>
          <b-tab lazy>
            <template #title>
              <feather-icon icon="PlusIcon" />
              <span>Create</span>
            </template>
            <create-assignment />
          </b-tab>
        </b-tabs>
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
import CourseMaterials from '@/views/modules/materials/CourseMaterials.vue'
import ViewAssignments from '@/views/modules/assignment/AllAssignments.vue'
import CreateAssignment from '@/views/modules/assignment/AddAssignment.vue'
import LessonPlan from '@/views/modules/materials/Curriculum.vue'
import ClassAttendance from '@/views/modules/attendance/ClassAttendance.vue'
import SubjectAttendance from '@/views/modules/attendance/SubjectAttendance.vue'
import TeacherRoutine from './AdminJoinOnlineClass.vue'

export default {
  components: {
    BTabs,
    BTab,
    TeacherRoutine,
    CourseMaterials,
    ViewAssignments,
    CreateAssignment,
    LessonPlan,
    ClassAttendance,
    SubjectAttendance,
  },
}
</script>
