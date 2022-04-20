<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <tbody>
        <tr>
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
        <tr v-if="student.my_classes.length > 0">

          <td><strong>Current Level: </strong><br>{{ (student.current_student_level !== null) ? student.current_student_level.level : 'Not Set' }}</td>
          <td><strong>Current Class: </strong><br>{{ (student.my_classes[0].class_teacher.c_class ) ? student.my_classes[0].class_teacher.c_class.name : 'Not Set' }}</td>
          <td><strong>Current Class Teacher: </strong><br>{{ (student.my_classes[0].class_teacher.staff) ? student.my_classes[0].class_teacher.staff.user.first_name+' '+student.my_classes[0].class_teacher.staff.user.last_name : 'Not Set' }}</td>
        </tr>

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
    <!-- <div class="col-md-12">
      <div align="center">
        <legend>CUMMULATIVE ACADEMIC PERFORMANCE ANALYSIS</legend>
      </div>
      <div class="col-md-6 padded">
        <label>Junior School</label>
        <div
          v-for="(junior_subject, index) in student.junior_subjects"
          :key="index"
          class="progress-group"
        >
          <div
            v-if="junior_subject.avg > 0"
            colspan="3"
          >
            <small class="progress-text">{{ junior_subject.name }}</small>
            <span class="progress-number"><b>{{ junior_subject.avg }}</b>%</span>

            <div class="progress sm">
              <div
                class="progress-bar"
                :style="'width: '+junior_subject.avg+'%; background: '+junior_subject.color"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 padded">
        <label>Senior School</label>
        <div
          v-for="(senior_subject, index) in student.senior_subjects"
          :key="index"
          class="progress-group"
        >
          <div
            v-if="senior_subject.avg > 0"
            colspan="3"
          >
            <small class="progress-text">{{ senior_subject.name }}</small>
            <span class="progress-number"><b>{{ senior_subject.avg }}</b>%</span>

            <div class="progress sm">
              <div
                class="progress-bar"
                :style="'width: '+senior_subject.avg+'%; background: '+senior_subject.color"
              />
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// import PanThumb from '@/components/PanThumb'
import {
  BAvatar,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'

export default {
  components: { BAvatar },
  props: {
    student: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      avatarText,
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
