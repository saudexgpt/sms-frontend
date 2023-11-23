<template>
  <div>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td
            align="center"
          >
            <img
              :src="baseServerUrl + 'storage/'+student.school.logo"
              width="200"
            >
            <h4>{{ student.school.name.toUpperCase() }}</h4>
            <p>{{ student.school.address }}</p>

          </td>
        </tr>
      </tbody>
    </table>
    <b-row>
      <b-col
        :xs="12"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
      >
        <div align="center">
          <h3>&nbsp;</h3>
        </div>
        <b-row>
          <b-col
            :xs="12"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <div
              class="box"
              style="border: medium solid rgb(240, 240, 240); border-radius: 10px; padding: 20px"
            >
              <div
                class="box-body text-center"
              >

                <h4
                  class="profile-username text-center"
                >
                  <strong>Current Level</strong><br>
                  {{ (student.current_student_level !== null) ? student.current_student_level.level : 'Not Set' }}
                </h4>
              </div>
            </div>
          </b-col>
          <b-col
            :xs="12"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <div
              class="box"
              style="border: medium solid rgb(240, 240, 240); border-radius: 10px; padding: 20px"
            >
              <div
                class="box-body text-center"
              >
                <h4
                  class="profile-username text-center"
                >
                  <strong>Current Class</strong><br>
                  {{ (student.class_teacher.c_class ) ? student.class_teacher.c_class.name : 'Not Set' }}
                </h4>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            :xs="12"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <student-routine :student-id="student.id" />
          </b-col>
        </b-row>
      </b-col>
      <b-col
        :xs="12"
        :sm="12"
        :md="4"
        :lg="4"
        :xl="4"
      >
        <div align="center">
          <h3>Class Teacher</h3>
        </div>
        <div v-if="student.class_teacher.staff">
          <user-bio :user="student.class_teacher.staff.user" />
        </div>
        <div v-else>
          <h4>Class is yet to be assigned a teacher</h4>
        </div>
      </b-col>
    </b-row>

  </div>
</template>

<script>
// import PanThumb from '@/components/PanThumb'
import {
  BRow, BCol,
// BAvatar,
} from 'bootstrap-vue'
// import { avatarText } from '@core/utils/filter'
import UserBio from '@/views/modules/user/UserBioData.vue'
import StudentRoutine from '@/views/modules/time-table/StudentRoutine.vue'

export default {
  components: {
    BRow, BCol, UserBio, StudentRoutine,
  },
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
