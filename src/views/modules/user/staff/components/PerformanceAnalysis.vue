<template>
  <div>
    <div class="box-body">
      <div class="row">
        <div class="col-md-5">
          <p class="text-center">
            <strong>Subject Performance Analysis</strong>
          </p>
          <div v-if="performance_response.subject_averages.length > 0">
            <div
              v-for="(subject, index) in performance_response.subject_averages"
              :key="index"
            >
              <div v-if="parseInt(subject.subject_average) > 0">
                <small class="progress-text">
                  {{ `${subject.subject.name} (${subject.class_teacher.c_class.name})` }}
                </small>
                <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="parseFloat(subject.subject_average)"
                  :status="chartStatus(parseFloat(subject.subject_average))"
                />
                <hr>
              </div>
              <!-- <small class="progress-text">{{ subject.subject.name }}</small>
              <span class="progress-number"><b>{{ subject.subject_average }}</b>%</span>

              <div class="progress sm">
                <div
                  class="progress-bar"
                  :style="'width: '+subject.subject_average+'%; background: '+subject.color"
                />
              </div> -->
            </div>
          </div>
          <div v-else>
            <div
              class="callout callout-danger"
              align="center"
            >
              No performance analysis for {{ staff.user.first_name+' '+staff.user.last_name }} in {{ selected_session.name }} Academic Session
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <aside>
            <el-row
              :gutter="0"
              class="panel-group"
            >
              <el-col
                :xs="24"
                :sm="24"
                :md="24"
                class="box-panel-col"
                style="background: #f0f0f0; padding: 5px;"
              >
                <el-select
                  v-model="selected_session"
                  value-key="id"
                  placeholder="Select Academic Session"
                  filterable
                  style="width: 100%"
                  @input="showPerformanceChart()"
                >
                  <el-option
                    v-for="(session, index) in all_sessions"
                    :key="index"
                    :value="session"
                    :label="session.name"
                  />
                </el-select>
              </el-col>
            </el-row>
            <h3 class="text-center">
              {{ staff.user.first_name+' '+staff.user.last_name+"'s" }}
            </h3>
            <p class="text-center">
              <strong>
                {{ selected_session.name }} Academic Session
              </strong>
            </p>
            <div class="chart">
              <!-- Sales Chart Canvas -->
              <highcharts :options="performance_analytics" />
            </div>
          </aside>
        </div>
      </div>
      <!-- /.row -->
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

const staffPrformanceResource = new Resource('teacher/performance-analysis')
export default {
  components: {},
  props: {
    staff: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      all_sessions: [],
      selected_session: '',
      sess_id: '',
      performance_response: {
        subject_averages: [],
      },
      performance_analytics: {
        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
        },
        title: {
          text: 'PERFORMANCE SCALE',
        },
        pane: {
          startAngle: -150,
          endAngle: 150,
          background: [
            {
              backgroundColor: {
                linearGradient: {
                  x1: 0, y1: 0, x2: 0, y2: 1,
                },
                stops: [[0, '#FFF'], [1, '#333']],
              },
              borderWidth: 0,
              outerRadius: '109%',
            },
            {
              backgroundColor: {
                linearGradient: {
                  x1: 0, y1: 0, x2: 0, y2: 1,
                },
                stops: [[0, '#333'], [1, '#FFF']],
              },
              borderWidth: 1,
              outerRadius: '107%',
            },
            {
              // default background
            },
            {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%',
            },
          ],
        },
        // the value axis
        yAxis: {
          min: 0,
          max: 100,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#000',
          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#000',
          labels: {
            step: 2,
            rotation: 'auto',
          },
          title: {
            text: '',
          },
          plotBands: [
            {
              from: 0,
              to: 40,
              color: '#DF5353', // red
            },
            {
              from: 40,
              to: 50,
              color: '#DDDF0D', // yellow
            },
            {
              from: 50,
              to: 60,
              color: '#4ef197', // light-green
            },
            {
              from: 60,
              to: 80,
              color: '#25f025', // green
            },
            {
              from: 80,
              to: 100,
              color: '#48a11e', // Dark-green
            },
          ],
        },
        series: [
          {
            name: 'Performance',
            data: [0],
            tooltip: {
              valueSuffix: '%',
            },
          },
        ],
        credits: {
          enabled: false,
        },
      },

      params: {
        sess_id: '',
        teacher_id: '',
      },
    }
  },
  mounted() {
    const app = this
    const { id } = app.$route.params
    app.params.teacher_id = id
    app.fetchTeacherAnalysis()
  },
  methods: {
    fetchTeacherAnalysis() {
      const app = this
      const param = app.params
      staffPrformanceResource.list(param, false)
        .then(response => {
          app.selected_session = response.selected_session
          app.all_sessions = response.all_sessions
          app.sess_id = response.sess_id
          app.performance_response = response
          app.performance_analytics.series[0].data = response.overall_performance
        })
    },
    showPerformanceChart() {
      const app = this
      app.sess_id = app.selected_session.id
      app.params.sess_id = app.sess_id
      app.fetchTeacherAnalysis()
    },
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
