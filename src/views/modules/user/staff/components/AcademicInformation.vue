<template>

  <div class="user-activity">
    <div class="post">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <td
              align="center"
            >
              <img
                :src="baseServerUrl + 'storage/'+staff.school.logo"
                width="200"
              >
              <h4>{{ staff.school.name.toUpperCase() }}</h4>
              <p>{{ staff.school.address }}</p>

            </td>
          </tr>
        </tbody>
      </table>

    </div>
    <div
      v-if="staff.class_teachers"
      class="post"
    >
      <h4>Assigned Class</h4>
      <div class="row">
        <div
          v-for="class_teacher in staff.class_teachers"
          :key="class_teacher.id"
          class="col-xs-12 col-sm-6 col-md-6"
        >
          <div
            class="box"
            style="border: medium solid #f0f0f0; border-radius: 10px; padding: 20px"
          >
            <div class="box-body">
              <h4 class="profile-username text-center">
                {{ class_teacher.c_class.name }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="staff.subject_teachers.length"
      class="post"
    >

      <div class="box-body">
        <h4>Assigned Subjects</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(subject_teacher, index) in staff.subject_teachers"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ subject_teacher.subject.name }}</td>
              <td>{{ subject_teacher.subject.code }}</td>
              <td>{{ subject_teacher.class_teacher.c_class.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
// import PanThumb from '@/components/PanThumb'

export default {
  // components: { PanThumb },
  props: {
    staff: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {

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
