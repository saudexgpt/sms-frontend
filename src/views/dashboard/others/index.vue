<template>
  <div class="dashboard-container">

    <component :is="currentRole" />
  </div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import LibrarianDashboard from '@/views/modules/library/index.vue'
import UserDashboard from '@/views/modules/user/Profile.vue'
import CompanyStaffDashboard from './partials/CompanyStaff.vue'

export default {
  components: {
    LibrarianDashboard, UserDashboard, CompanyStaffDashboard,
  },
  data() {
    return {
      currentRole: 'UserDashboard',
    }
  },
  computed: {
    ...mapGetters([
      'userData',
    ]),
  },
  created() {
    if (this.userData.roles.includes('librarian')) {
      this.currentRole = 'LibrarianDashboard'
    }
    if (this.userData.roles.includes('company-staff')) {
      this.currentRole = 'CompanyStaffDashboard'
    }
  },
}
</script>
