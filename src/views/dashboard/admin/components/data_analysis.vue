<template>
  <div v-if="dashboardData !== null">
    <el-row
      :gutter="8"
    >
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="white"
          bg="primary"
          icon="UserPlusIcon"
          :statistic="dashboardData.active_students"
          statistic-title="Active Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="white"
          bg="warning"
          icon="UserMinusIcon"
          :statistic="dashboardData.suspended_students"
          statistic-title="Suspended Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="white"
          bg="success"
          icon="UserCheckIcon"
          :statistic="dashboardData.alumni"
          statistic-title="Graduated Student"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="white"
          bg="danger"
          icon="UserXIcon"
          :statistic="dashboardData.withdrawn_students"
          statistic-title="Withdrawn Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="white"
          bg="secondary"
          icon="UsersIcon"
          :statistic="dashboardData.totalStaff"
          statistic-title="Active Personnels"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="white"
          bg="dark"
          icon="UsersIcon"
          :statistic="dashboardData.totalGuardian"
          statistic-title="Total Guardians"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { } from 'bootstrap-vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

export default {
  components: {
    StatisticCardHorizontal,
  },
  props: {
    dashboardData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
}
</script>
