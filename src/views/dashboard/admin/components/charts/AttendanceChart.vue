<template>
  <div class="app-container">
    <div class="box">
      <div class="box-header">
        <h5 class="box-title">
          Pick Date
        </h5>
      </div>
      <div class="box-body">
        <aside
          :gutter="0"
          class="panel-group"
        >
          <el-date-picker
            v-model="params.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
            :picker-options="datePickerOptions"
            value-format="yyyy-MM-dd"
            @input="loadChart()"
          />
        </aside>
        <div
          v-loading="load"
          :gutter="0"
          class="panel-group"
        >
          <b-row class="match-height">
            <b-col lg="12">
              <highcharts
                :options="chart_analytics"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
// import Multiselect from 'vue-multiselect'
import { $themeColors } from '@themeConfig'
import Resource from '@/api/resource'

const chartDataFetch = new Resource('report/display-chart')
export default {
  components: { BRow, BCol },
  props: {
    role: {
      type: String,
      default: () => (''),
    },
  },
  data() {
    return {
      total_male: 0,
      total_female: 0,
      all_sessions: [],
      selected_session: '',
      admission_sess_id: '',

      chart_analytics: {
        chart: {
          type: 'areaspline',
          inverted: false,
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25,
          },
          // scrollablePlotArea: {
          //   minWidth: 900,
          //   scrollPositionX: 1,
          // },
          events: {
          },
        },
        title: {
          text: '',
        },
        subtitle: {
          text: '',
        },
        xAxis: {
          type: 'category', // categories: [],
          labels: {
            skew3d: false,
            style: {
              fontSize: '14px',
            },
          },
          title: {
            text: 'Levels',
          },
          min: 0,
          max: undefined,
          scrollbar: {
            enabled: true,
          },
        },
        yAxis: {
          min: 0,
          max: undefined,
          tickInterval: 5,
          title: {
            text: 'No. of Students',
          },
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: 'bold',
              color: 'gray',
            },
          },
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
              // rotation: 180,
            },
            // borderRadius: 7,
          },
        },
        colors: [$themeColors.success, $themeColors.danger],
        series: [

        ],
        drilldown: {
          type: 'column',
          allowPointDrilldown: false,
          series: [],
        },

        // colors: ['#063', '#910000'],
        credits: {
          enabled: false,
        },
      },
      datePickerOptions: {

        // eslint-disable-next-line consistent-return
        disabledDate(date) {
          if (date > new Date()) {
            return true
          }
        },
      },
      params: {
        category: 'attendance',
        role: this.role,
        date: '',

      },
      load: false,
    }
  },

  created() {
    const { role } = this

    this.params.category = 'attendance'
    this.params.role = role
    this.loadChart()
  },

  methods: {
    loadChart() {
      // this.handleCenterLoading();
      // this.loading = true;
      const app = this
      // axios.get('report/display-chart'+params)
      app.load = true
      chartDataFetch.list(this.params).then(data => {
        // this.chart_analytics.xAxis.categories = data.categories;
        app.chart_analytics.series = data.series
        // app.chart_analytics.drilldown.series = data.drilldown_series
        app.chart_analytics.subtitle.text = data.subtitle
        app.chart_analytics.title.text = data.title

        // app.selected_session = data.selected_session
        // app.all_sessions = data.all_sessions
        // app.admission_sess_id = data.admission_sess_id
        // app.genderChat.series = [data.total_male, data.total_female]
        // app.total_male = data.total_male
        // app.total_female = data.total_female
        app.load = false
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },

    // showAdmissionChart() {
    //   this.admission_sess_id = this.selected_session.id
    //   const { admission_sess_id } = this
    //   const { role } = this
    // // alert(admission_sess_id);
    //   const category = 'admission'
    //   // var params = '?category='+category+"&admission_sess_id="+admission_sess_id+'&role='+role;
    //   this.params.category = category
    //   this.params.admission_sess_id = admission_sess_id
    //   this.params.role = role
    //   this.loadChart()
    //   // window.location = toUrl;
    // },

  },

}

</script>
