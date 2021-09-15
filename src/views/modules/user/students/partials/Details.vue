<template>
  <div>
    <div class="mb-1">
      <b-button
        variant="gradient-danger"
        class="btn-icon"
      >
        <router-link
          :to="{name: 'manage-student'}"
          style="color: #fff;"
        >
          Back
        </router-link>
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
    if (this.student_id) {
      const id = this.student_id
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
