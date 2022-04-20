<template>
  <div class="dashboard-container">

    <component :is="currentRole" />
  </div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import AdminDashboard from './admin/index.vue'
import OthersDashboard from './others/index.vue'
import TeacherDashboard from './teacher/index.vue'
import StudentDashboard from './student/index.vue'
import ParentDashboard from './parent/index.vue'
import SuperAdminDashboard from './super/index.vue'

export default {
  components: {
    AdminDashboard, OthersDashboard, TeacherDashboard, StudentDashboard, ParentDashboard, SuperAdminDashboard,
  },
  data() {
    return {
      currentRole: 'OthersDashboard',
    }
  },
  computed: {
    ...mapGetters([
      'userData',
    ]),
  },
  created() {
    if (this.userData.roles.includes('admin')) {
      this.currentRole = 'AdminDashboard'
    } else if (this.userData.roles.includes('teacher')) {
      this.currentRole = 'TeacherDashboard'
    } else if (this.userData.roles.includes('student')) {
      this.currentRole = 'StudentDashboard'
    } else if (this.userData.roles.includes('parent')) {
      this.currentRole = 'ParentDashboard'
    } else if (this.userData.roles.includes('super')) {
      this.currentRole = 'SuperAdminDashboard'
    }
  },
}
</script>
