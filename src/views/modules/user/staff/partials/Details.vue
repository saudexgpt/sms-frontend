<template>
  <div v-loading="load">
    <div
      v-if="staffId === null"
      class="mb-1"
    >
      <b-button
        variant="gradient-danger"
        class="btn-icon"
        @click="$router.go(-1)"
      >
        Back
      </b-button>
    </div>
    <template v-if="staff">
      <!-- First Row -->
      <b-row>
        <b-col
          :xs="12"
          :sm="12"
          :md="3"
          :lg="3"
          :xl="3"
        >
          <user-bio :user="staff.user" />
        </b-col>
        <b-col
          :xs="12"
          :sm="12"
          :md="9"
          :lg="9"
          :xl="9"
        >
          <b-card v-if="staff.user">
            <el-tabs v-model="activeActivity">
              <el-tab-pane
                label="Role Information"
                name="first"
              >
                <academic-information :staff="staff" />
              </el-tab-pane>
              <el-tab-pane
                label="Performance Analysis"
                name="second"
              >
                <performance-analysis :staff="staff" />
              </el-tab-pane>
              <el-tab-pane
                v-if="can_edit"
                label="Profile Update"
                name="third"
              >
                <update-profile :staff="staff" />

              </el-tab-pane>
            </el-tabs>
          </b-card>
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script>
import {
  BRow, BCol, BButton, BCard,
} from 'bootstrap-vue'
// import InvoiceList from '@/views/apps/invoice/invoice-list/InvoiceList.vue'
import Resource from '@/api/resource'
// import userStoreModule from '../userStoreModule'
// import UserViewUserInfoCard from './UserViewUserInfoCard.vue'
// import UserViewUserPlanCard from './UserViewUserPlanCard.vue'
// import UserViewUserTimelineCard from './UserViewUserTimelineCard.vue'
// import UserViewUserPermissionsCard from './UserViewUserPermissionsCard.vue'
import UserBio from '@/views/modules/user/UserBioData.vue'
import UpdateProfile from '../components/UpdateProfile.vue'
import AcademicInformation from '../components/AcademicInformation.vue'
import PerformanceAnalysis from '../components/PerformanceAnalysis.vue'

const staffResource = new Resource('user-setup/staff/show')

export default {
  components: {
    BButton,
    UserBio,
    BRow,
    BCol,
    BCard,
    AcademicInformation,
    UpdateProfile,
    PerformanceAnalysis,
  },
  props: {
    staffId: {
      type: Number,
      default: () => (null),
    },
  },
  data() {
    return {
      activeActivity: 'first',
      staff: '',
      load: false,
    }
  },
  created() {
    if (this.staffId) {
      const id = this.staffId
      this.getStaff(id)
    } else {
      const id = this.$route.params && this.$route.params.id
      this.getStaff(id)
    }
  },
  methods: {
    getStaff(id) {
      const app = this
      app.load = true
      staffResource.get(id)
        .then(response => {
          app.staff = response.staff
          app.can_edit = response.can_edit
          app.load = false
        })
    },

  },
}
</script>

<style>

</style>
