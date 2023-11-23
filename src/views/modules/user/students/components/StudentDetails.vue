<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <tbody>
        <!-- <tr>
          <td
            colspan="2"
            align="center"
          >
            <img
              :src="baseServerUrl + 'storage/'+student.school.logo"
              width="200"
            >
            <h4>{{ student.school.name.toUpperCase() }}</h4>
            <p>{{ student.school.address }}</p>

          </td>
          <td rowspan="1">
            <div class="user-avatar box-center">
              <b-avatar
                :src="baseServerUrl +'storage/' + student.user.photo"
                variant="light-primary"
                :text="avatarText(student.user.first_name +' ' + student.user.last_name)"
                size="120px"
                rounded
              />
            </div>
          </td>
        </tr>
        <tr>
          <td
            colspan="3"
            align="center"
          >
            <h4>BIO DATA</h4>
          </td>
        </tr>
        <tr>
          <td><strong>Surname: </strong><br>{{ student.user.last_name }}</td>
          <td><strong>Other Name(s): </strong><br>{{ student.user.first_name }}</td>
          <td><strong>Registration No.: </strong><br>{{ student.registration_no }}</td>
        </tr>
        <tr>
          <td><strong>Gender: </strong><br>{{ student.user.gender.toUpperCase() }}</td>
          <td><strong>DOB: </strong><br>{{ student.user.dob }}</td>
          <td><strong>Religion: </strong><br>{{ student.user.religion }}</td>

        </tr>
        <tr>
          <td><strong>Residential Address: </strong><br>{{ student.user.address }}</td>
          <td><strong>State of Origin: </strong><br>{{ (student.user.state !== null) ? student.user.state.name : 'NIL' }}</td>
          <td><strong>LGA of Origin: </strong><br>{{ (student.user.lga !== null) ? student.user.lga.name : 'NIL' }}</td>

        </tr>
        <tr v-if="student.class_teacher">

          <td><strong>Current Level: </strong><br>{{ (student.current_student_level !== null) ? student.current_student_level.level : 'Not Set' }}</td>
          <td><strong>Current Class: </strong><br>{{ (student.class_teacher.c_class ) ? student.class_teacher.c_class.name : 'Not Set' }}</td>
          <td><strong>Current Class Teacher: </strong><br>{{ (student.class_teacher.staff) ? student.class_teacher.staff.user.first_name+' '+student.class_teacher.staff.user.last_name : 'Not Set' }}</td>
        </tr> -->

        <tr v-if="student.student_guardian != null">
          <td
            colspan="3"
            align="center"
          >
            <h4>PARENT/GUARDIAN INFORMATION</h4>
          </td>
        </tr>
        <tr v-if="student.student_guardian !== null">
          <td><strong>Name: </strong><br>{{ student.student_guardian.guardian.user.first_name }} {{ student.student_guardian.guardian.user.last_name }}</td>
          <td><strong>Email: </strong><br>{{ student.student_guardian.guardian.user.email }}</td>
          <td><strong>Relationship: </strong><br>{{ student.student_guardian.relationship }}</td>

        </tr>
        <tr v-if="student.student_guardian !== null">
          <td><strong>Occupation: </strong><br>{{ student.student_guardian.guardian.occupation }}</td>
          <td><strong>Primary Phone No.: </strong><br>{{ student.student_guardian.guardian.user.phone1 }}</td>
          <td><strong>Alternative Phone No.: </strong><br>{{ student.student_guardian.guardian.user.phone2 }}</td>
        </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
// import PanThumb from '@/components/PanThumb'
import {
// BAvatar,
} from 'bootstrap-vue'
// import { avatarText } from '@core/utils/filter'

export default {
  components: {},
  props: {
    student: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // avatarText,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },

  },
  mounted() {
    // console.log(this.student)
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>

.user-profile {
  .user-name {
    font-weight: bold;
  }
  .box-center {
    padding-top: 10px;
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
  .box-social {
    padding-top: 30px;
    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }
  .user-follow {
    padding-top: 20px;
  }
}
</style>
