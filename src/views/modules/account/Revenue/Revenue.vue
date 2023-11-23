<template>
  <el-card>
    <b-tabs content-class="mt-1">
      <!-- This tabs content will always be mounted -->
      <!-- <b-tab lazy>
        <template #title>
          <feather-icon icon="CreditCardIcon" />
          <span>Income & Expenses</span>
        </template>
        <income-expenses />
      </b-tab> -->
      <!-- This tabs content will not be mounted until the tab is shown -->
      <!-- and will be un-mounted when hidden -->
      <b-tab v-if="checkPermission(['can view account statement'])">
        <template #title>
          <feather-icon icon="FileTextIcon" />
          <span>Statement of Account</span>
        </template>
        <account-statement />
      </b-tab>
      <b-tab v-if="checkPermission(['can view account statement'])">
        <template #title>
          <feather-icon icon="BarChartIcon" />
          <span>Debtors List</span>
        </template>
        <debtors
          v-if="sessions.length > 0"
          type="Debtors"
          :sessions="sessions"
          :terms="terms"
        />
      </b-tab>
      <b-tab v-if="checkPermission(['can view account statement'])">
        <template #title>
          <feather-icon icon="PieChartIcon" />
          <span>Revenue Chart</span>
        </template>
        <revenue
          v-if="sessions.length > 0"
          type="Revenue"
          :sessions="sessions"
        />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
// import IncomeExpenses from './IncomeExpenses.vue'
import AccountStatement from './AccountStatement.vue'
import Revenue from '@/views/dashboard/admin/components/charts/Revenue.vue'
// import Debtors from '@/views/dashboard/admin/components/charts/Debtors.vue'
import Debtors from './Debtors.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    // IncomeExpenses,
    AccountStatement,
    Revenue,
    Debtors,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      sessions: [],
      terms: [],
    }
  },
  created() {
    this.fetchTermAndSession()
  },
  methods: {
    checkPermission,
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
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
