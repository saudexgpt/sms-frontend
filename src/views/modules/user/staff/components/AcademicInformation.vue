<template>

  <div
    v-if="student"
    class="table-responsive"
  >

    <div>
      <div align="center">
        <img
          :src="'storage/'+student.user.photo"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        ><br>
        <strong>{{ student.user.last_name+', '+student.user.first_name }}</strong><br>
        <strong>{{ student.registration_no }}</strong>

        <h4>SUBJECT PERFORMANCE ANALYSIS</h4>
      </div>
      <div class="col-md-6 padded">
        <legend>Junior School</legend>
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
        <legend>Senior School</legend>
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
    </div>

  </div>
</template>

<script>
// import PanThumb from '@/components/PanThumb'

export default {
  // components: { PanThumb },
  props: {
    student: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {

    }
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
