<template>
  <div v-loading="load">
    <data-analysis
      v-if="dashboardData !== null"
      :dashboard-data="dashboardData"
    />
    <b-row class="match-height">
      <b-col lg="12">
        <admin-chart
          :sessions="sessions"
          :terms="terms"
        />
      </b-col>
    </b-row>
    <b-row class="match-height">
      <b-col lg="7">

        <timeline />
      </b-col>
      <b-col lg="5">
        <div style="max-height: 2000px; overflow: auto;">
          <events />
        </div>
      </b-col>
    </b-row>

  </div>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import DataAnalysis from './components/data_analysis.vue'
import AdminChart from './components/admin_report_chart.vue'
import Timeline from '@/views/modules/user/Timeline.vue'
import Events from '@/views/modules/news-and-event/Calendar.vue'
// import Revenue from './components/charts/Revenue.vue'
// import Debtors from './components/charts/Debtors.vue'

import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    DataAnalysis,
    AdminChart,
    Timeline,
    Events,
    // Revenue,
    // Debtors,
  },
  data() {
    return {
      dashboardData: null,
      load: false,
      terms: [],
      sessions: [],
    }
  },
  created() {
    this.fetchTermAndSession()
    this.fetchData()
  },
  methods: {
    fetchTermAndSession() {
      const app = this
      const fetchSession = new Resource('school-setup/fetch-session-and-term')
      fetchSession.list().then(response => {
        app.sessions = response.sessions
        app.terms = response.terms
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
    fetchData() {
      const app = this
      app.load = true
      const adminDashboardResource = new Resource('dashboard/admin')
      adminDashboardResource.list()
        .then(response => {
          app.dashboardData = response
          app.load = false
        }).catch(error => {
          console.log(error)
          app.load = false
        })
    },
  },
}
</script>
