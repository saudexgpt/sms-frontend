<template>
  <div v-if="statistics.length > 0">
    <el-row
      :gutter="8"
    >
      <el-col
        v-for="(item, index) in statistics"
        :key="index"
        :xs="24"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <statistic-card-horizontal
          color="white"
          :bg="item.color"
          :icon="item.icon"
          :statistic="item.statistic"
          :statistic-title="item.title"
          :custom-style="'border-top-left-radius: 1rem; border-bottom-right-radius: 1rem'"
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
    return {
      statistics: [],
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData() {
      const app = this
      const data = [
        // {
        //   color: 'primary', icon: 'UsersIcon', statistic: app.dashboardData.population, title: 'Total Users',
        // },
        // {
        //   color: 'success', icon: 'TrendingUpIcon', statistic: app.dashboardData.total_income, title: 'Total Income',
        // },
        // {
        //   color: 'warning', icon: 'TrendingDownIcon', statistic: app.dashboardData.total_expenses, title: 'Total Expenses',
        // },
        // {
        //   color: 'danger', icon: 'CreditCardIcon', statistic: app.dashboardData.total_debts, title: 'Total Debts',
        // },

        {
          color: 'primary', icon: 'UserPlusIcon', statistic: app.dashboardData.total_students, title: 'Active Students',
        },
        // {
        //   color: 'primary', icon: 'UserPlusIcon', statistic: app.dashboardData.active_students, title: 'Active Students',
        // },
        // {
        //   color: 'warning', icon: 'UserMinusIcon', statistic: app.dashboardData.suspended_students, title: 'Suspended Students',
        // },
        // {
        //   color: 'success', icon: 'UserCheckIcon', statistic: app.dashboardData.alumni, title: 'Graduated Students',
        // },
        {
          color: 'danger', icon: 'UserXIcon', statistic: app.dashboardData.withdrawn_students, title: 'Withdrawn Students',
        },
        {
          color: 'warning', icon: 'UsersIcon', statistic: app.dashboardData.totalStaff, title: 'Active Personnel',
        },
        {
          color: 'dark', icon: 'UsersIcon', statistic: app.dashboardData.totalGuardian, title: 'Parents/Guardians',
        },
      ]
      app.statistics = data
    },
  },
}
</script>
