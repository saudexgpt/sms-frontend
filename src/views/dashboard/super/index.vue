<template>
  <div v-loading="load">
    <data-analysis :dashboard-data="dashboardData" />

    <!-- <admin-chart /> -->

  </div>
</template>
<script>
import DataAnalysis from './components/data_analysis.vue'
// import AdminChart from './components/admin_report_chart.vue'

import Resource from '@/api/resource'

export default {
  components: {
    DataAnalysis,
  },
  data() {
    return {
      dashboardData: null,
      load: false,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const app = this
      app.load = true
      const adminDashboardResource = new Resource('dashboard/super')
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
