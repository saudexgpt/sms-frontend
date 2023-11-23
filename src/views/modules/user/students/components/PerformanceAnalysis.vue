<template>

  <div
    v-if="student"
  >

    <div>
      <div align="center">
        <h4>CUMULATIVE SUBJECT PERFORMANCE ANALYSIS</h4>
        <small>Analyzed performance can be used to advice students on career path</small>
      </div>
      <el-row
        v-if="student.subject_performances !== '[]'"
        :gutter="20"
      >
        <el-col
          v-for="(subject_performance_details, key) in student.subject_performances"
          :key="key"
          :xs="24"
          :md="12"
        >
          <div style="background: #fcfcfc; border-radius: 10px; padding: 10px">
            <legend>{{ key }}</legend>
            <div
              v-for="(subject_performance, index) in subject_performance_details"
              :key="index"
              class="progress-group"
            >
              <div
                v-if="parseInt(subject_performance.avg) > 0"
              >
                <small class="progress-text">{{ subject_performance.name }}</small>
                <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="parseFloat(subject_performance.avg)"
                  :status="chartStatus(parseFloat(subject_performance.avg))"
                />
                <hr>
              <!-- <small class="progress-text">{{ subject_performance.name }}</small>
              <span class="progress-number"><b>{{ subject_performance.avg }}</b>%</span>

              <div class="progress sm">
                <div
                  class="progress-bar"
                  :style="'width: '+subject_performance.avg+'%; background: '+subject_performance.color"
                />
              </div> -->
              </div>
            </div>
          </div>
          <hr>
        </el-col>
      </el-row>
      <el-empty
        v-else
        description="There is no data to analyze"
      />
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
    chartStatus(average) {
      if (average >= 70 && average <= 100) {
        return 'success'
      } if (average >= 60 && average <= 69.99) {
        return 'primary'
      } if (average >= 45 && average <= 59.99) {
        return 'warning'
      }
      return 'exception'
    },
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
