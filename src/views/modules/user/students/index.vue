<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
    >
      <!-- This tabs content will always be mounted -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>List</span>
        </template>
        <students-table />
      </b-tab>
      <!-- This tabs content will not be mounted until the tab is shown -->
      <!-- and will be un-mounted when hidden -->
      <b-tab>
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Single Registration</span>
        </template>
        <register-new-student />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UploadIcon" />
          <span>Bulk Registration</span>
        </template>
        <register-bulk-students />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="CornerRightUpIcon" />
          <span>Promote</span>
        </template>
        <promote-students />
      </b-tab>
      <b-tab
        title="Alumni"
        lazy
      >
        <template #title>
          <feather-icon icon="UserCheckIcon" />
          <span>Alumni</span>
        </template>
        <alumni />
      </b-tab>
      <!-- <b-tab>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>Duplicate Students</span>
        </template>
        <duplicate-students />
      </b-tab> -->
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import StudentsTable from './partials/Student.vue'
// import DuplicateStudents from './partials/DuplicateStudents.vue'
import RegisterNewStudent from './partials/RegisterNewStudents.vue'
import RegisterBulkStudents from './partials/RegisterBulkStudents.vue'
import PromoteStudents from './partials/PromoteStudents.vue'
import Alumni from './partials/Alumni.vue'

export default {
  components: {
    BTabs,
    BTab,
    StudentsTable,
    // DuplicateStudents,
    RegisterNewStudent,
    RegisterBulkStudents,
    PromoteStudents,
    Alumni,
  },
}
</script>
