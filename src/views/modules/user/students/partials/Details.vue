<template>
  <div v-loading="load">
    <div
      v-if="studentId === null"
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
    <b-row>
      <b-col
        :xs="12"
        :sm="12"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <user-bio :user="student.user" />
      </b-col>
      <b-col
        :xs="12"
        :sm="12"
        :md="9"
        :lg="9"
        :xl="9"
      >
        <el-card v-if="student.user">
          <el-tabs v-model="activeActivity">
            <el-tab-pane
              label="Academic Information"
              name="first"
            >
              <academic-information :student="student" />
            </el-tab-pane>
            <el-tab-pane
              label="Performance Analysis"
              name="second"
            >
              <performance-analysis :student="student" />
            </el-tab-pane>
            <el-tab-pane
              label="Guardian Information"
              name="third"
            >
              <student-details :student="student" />
            </el-tab-pane>
            <el-tab-pane
              v-if="can_edit"
              label="Profile Update"
              name="third"
            >
              <update-profile :student="student" />

            </el-tab-pane>
          </el-tabs>
        </el-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

import UserBio from '@/views/modules/user/UserBioData.vue' // '../components/StudentBio.vue'
import StudentDetails from '../components/StudentDetails.vue'
// import StudentCurrentClassDetails from '../components/StudentCurrentClassDetails.vue'
// import UpdateProfile from '../components/UpdateProfile.vue'
import AcademicInformation from '../components/AcademicInformation.vue'
import PerformanceAnalysis from '../components/PerformanceAnalysis.vue'

const studentResource = new Resource('user-setup/students/show')
export default {
  name: 'EditStudent',
  components: {
    BRow,
    BCol,
    BButton,
    UserBio,
    StudentDetails,
    AcademicInformation,
    PerformanceAnalysis,
    // StudentCurrentClassDetails,
    /* UpdateProfile */
  },
  props: {
    studentId: {
      type: Number,
      default: () => (null),
    },
  },
  // props: ['student_id'],
  data() {
    return {
      activeActivity: 'first',
      student: {},
      can_edit: false,
      load: false,
    }
  },
  watch: {
    $route: 'getStudent',
  },
  created() {
    if (this.studentId) {
      const id = this.studentId
      this.getStudent(id)
    } else {
      const id = this.$route.params && this.$route.params.id
      this.getStudent(id)
    }
  },
  methods: {
    getStudent(id) {
      const app = this
      app.load = true
      studentResource.get(id)
        .then(response => {
          app.student = response.student
          app.can_edit = response.can_edit
          app.load = false
        })
    },

  },
}
</script>
