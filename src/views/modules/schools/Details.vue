<template>
  <div v-loading="load">
    <div
      v-if="schoolId === null"
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
    <!-- Data Analysis-->
    <el-row
      :gutter="8"
    >
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="primary"
          icon="UserPlusIcon"
          :statistic="details.active_students"
          statistic-title="Active Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="warning"
          icon="UserMinusIcon"
          :statistic="details.suspended_students"
          statistic-title="Suspended Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="success"
          icon="UserCheckIcon"
          :statistic="details.alumni"
          statistic-title="Graduated Student"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="danger"
          icon="UserXIcon"
          :statistic="details.withdrawn_students"
          statistic-title="Withdrawn Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          icon="UsersIcon"
          :statistic="details.totalStaff"
          statistic-title="Active Personnels"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="info"
          icon="UsersIcon"
          :statistic="details.totalGuardian"
          statistic-title="Total Guardians"
        />
      </el-col>
    </el-row>
    <!-- Data Analysis-->
    <!-- School Details-->
    <el-row :gutter="8">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
      >
        <el-card>
          <el-row>
            <el-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="12"
            >
              <img
                :src="baseServerUrl +'storage/'+details.school.logo"
                style="width: 80%"
              >
              <div class="demo-inline-spacing">
                <b-form-checkbox
                  v-model="details.school.nursery"
                  value="1"
                  class="custom-control-danger"
                  :disabled="!checkPermission(['can manage schools'])"
                  @change="setArm(details.school.id, 'nursery', $event)"
                >
                  Nursery
                </b-form-checkbox>
                <b-form-checkbox
                  v-model="details.school.pry"
                  value="1"
                  class="custom-control-primary"
                  :disabled="!checkPermission(['can manage schools'])"
                  @change="setArm(details.school.id, 'pry', $event)"
                >
                  Primary
                </b-form-checkbox>
                <b-form-checkbox
                  v-model="details.school.secondary"
                  value="1"
                  class="custom-control-success"
                  :disabled="!checkPermission(['can manage schools'])"
                  @change="setArm(details.school.id, 'secondary', $event)"
                >
                  Secondary
                </b-form-checkbox>
              </div>
              <br>
              <el-alert
                :title="'Current Package: ' + details.school.package.name"
                type="success"
                :closable="false"
              />
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="12"
            >
              <table class="table table-striped">
                <tbody>
                  <tr>
                    <th>
                      Full Name:
                    </th>
                    <th>
                      {{ details.school.name }}
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Abbreviated Name
                    </th>
                    <th>
                      {{ details.school.slug }}
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Email
                    </th>
                    <th>
                      {{ details.school.email }}
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Phone No.
                    </th>
                    <th>
                      {{ details.school.phone }}
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Address
                    </th>
                    <th>
                      {{ details.school.address }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <!-- School Details-->
    <el-row :gutter="8">
      <el-tabs type="border-card">
        <el-tab-pane label="Students">
          <students-list :student-data="details.school.students" />
        </el-tab-pane>
        <el-tab-pane label="Staff">
          <staff-list :staff-data="details.school.staff" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import {
  BButton, BFormCheckbox,
} from 'bootstrap-vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import StudentsList from './partials/StudentsList.vue'
import StaffList from './partials/StaffList.vue'

const schoolResource = new Resource('schools/show')
export default {
  name: 'SchoolDetails',
  components: {
    StudentsList,
    StaffList,
    // BRow,
    // BCol,
    BButton,
    StatisticCardHorizontal,
    BFormCheckbox,
    // UserBio,
    // SchoolDetails,
    // SchoolCurrentClassDetails,
    /* UpdateProfile  AcademicInformation */
  },
  props: {
    schoolId: {
      type: Number,
      default: () => (null),
    },
  },
  // props: ['school_id'],
  data() {
    return {
      activeActivity: 'first',
      school: {},
      can_edit: false,
      details: {
        active_students: 0,
        suspended_students: 0,
        withdrawn_students: 0,
        alumni: 0,
        totalGuardian: 0,
        totalStaff: 0,
        school: {},

      },
      load: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  watch: {
    $route: 'getSchool',
  },
  created() {
    if (this.schoolId) {
      const id = this.schoolId
      this.getSchool(id)
    } else {
      const id = this.$route.params && this.$route.params.id
      this.getSchool(id)
    }
  },
  methods: {
    checkPermission,
    getSchool(id) {
      const app = this
      app.load = true
      schoolResource.get(id).then(response => {
        this.details = response
        app.load = false
      })
    },
    async setArm(id, arm, event) {
      let value = '1'
      if (event === false) {
        value = '0'
      }
      const param = {
        school_id: id, arm, value,
      }
      const setArmResource = new Resource('schools/set-school-arms')
      const response = await setArmResource.store(param)
      console.log(response)
    },

  },
}
</script>
