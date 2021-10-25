<template>
  <div>
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
    <el-card v-if="student.user">
      <el-tabs v-model="activeActivity">
        <el-tab-pane
          :label="student.user.last_name+'\'s Information'"
          name="first"
        >
          <student-details :student="student" />
        </el-tab-pane>
        <!-- <el-tab-pane
          label="Academic Information"
          name="second"
        >
          <academic-information :student="student" />
        </el-tab-pane> -->
        <el-tab-pane
          v-if="can_edit"
          label="Profile Update"
          name="third"
        >
          <update-profile :student="student" />

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
import Resource from '@/api/resource'
// import UserBio from '@/views/modules/user/UserBioData.vue' // '../components/StudentBio.vue'
import StudentDetails from '../components/StudentDetails.vue'
// import StudentCurrentClassDetails from '../components/StudentCurrentClassDetails.vue'
// import UpdateProfile from '../components/UpdateProfile.vue'
// import AcademicInformation from '../components/AcademicInformation.vue'

const studentResource = new Resource('user-setup/students/show')
export default {
  name: 'EditStudent',
  components: {
    // BRow,
    // BCol,
    BButton,
    // UserBio,
    StudentDetails,
    // StudentCurrentClassDetails,
    /* UpdateProfile  AcademicInformation */
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
    async getStudent(id) {
      const response = await studentResource.get(id)
      this.student = response.student
      this.can_edit = response.can_edit
    },

  },
}
</script>
