<template>
  <div class="dashboard-container">
    <student-details
      v-if="role==='student'"
      :student-id="currentRoleId"
    />
    <staff-details
      v-if="role==='staff'"
      :staff-id="currentRoleId"
    />
    <parent-details
      v-if="role==='parent'"
      :guardian-id="currentRoleId"
    />
    <user-bio-data
      v-if="role==='others'"
      :user="userData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StudentDetails from '@/views/modules/user/students/partials/Details.vue'
import StaffDetails from '@/views/modules/user/staff/partials/Details.vue'
import ParentDetails from '@/views/modules/user/parents/Details.vue'
import UserBioData from '@/views/modules/user/UserBioData.vue'

export default {
  // name: 'Dashboard',
  components: {
    StudentDetails, StaffDetails, ParentDetails, UserBioData,
  },
  data() {
    return {
      currentRoleId: null,
      role: null,
    }
  },
  computed: {
    ...mapGetters([
      'userData',
    ]),
  },
  created() {
    if (this.userData.roles.includes('staff')) {
      this.currentRoleId = this.userData.staff.id
      this.role = 'staff'
    } else if (this.userData.roles.includes('student')) {
      this.currentRoleId = this.userData.student.id
      this.role = 'student'
    } else if (this.userData.roles.includes('parent')) {
      this.currentRoleId = this.userData.guardian.id
      this.role = 'parent'
    } else {
      this.role = 'others'
    }
  },
}
</script>
