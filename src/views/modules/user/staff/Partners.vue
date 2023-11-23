<template>
  <el-card>
    <b-tabs content-class="mt-1">
      <!-- This tabs content will always be mounted -->
      <b-tab>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>Staff List</span>
        </template>
        <staff-table />
      </b-tab>

      <!-- This tabs content will not be mounted until the tab is shown -->
      <!-- and will be un-mounted when hidden -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Add A New Staff</span>
        </template>
        <register-new-staff />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="KeyIcon" />
          <span>Assign Privileges</span>
        </template>
        <assign-access />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import { BTabs, BTab } from 'bootstrap-vue'
import AssignAccess from '@/views/modules/access-control/partials/AssignStaffAccess.vue'
import StaffTable from './partials/CompanyStaffTable.vue'
import RegisterNewStaff from './partials/RegisterNewCompanyStaff.vue'

export default {
  components: {
    BTabs,
    BTab,
    StaffTable,
    RegisterNewStaff,
    AssignAccess,
  },
}
</script>
