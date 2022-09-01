<template>
  <div>
    <!-- <div
      slot="header"
      class="clearfix no-print"
    >
      <span><h3>Statement of Account</h3></span>
    </div> -->
    <b-row class="no-print">
      <b-col cols="12">
        <span>Pick Date Range</span>
      </b-col>
      <b-col
        cols="7"
      >
        <span
          class="demo-inline-spacing"
        >
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="To"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            unlink-panels
            style="width: 70%"
            :picker-options="pickerOptions"
          />
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-primary"
            :disabled="form.date === ''"
            @click="fetchAccountStatement()"
          >
            <span class="align-middle">Fetch</span>
          </b-button>
        </span>
      </b-col>
      <b-col
        cols="5"
      >
        <span
          class="demo-inline-spacing pull-right"
        >
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-warning"
            :disabled="statements.length < 1"
            @click="handleDownload('Statement of Account from ' + table_title, statements)"
          >
            <feather-icon
              icon="DownloadIcon"
              class="mr-50"
            />
            <span class="align-middle">Export</span>
          </b-button>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-dark"
            :disabled="statements.length < 1"
            @click="printCard()"
          >
            <feather-icon
              icon="PrinterIcon"
              class="mr-50"
            />
            <span class="align-middle">Print</span>
          </b-button>
        </span>
      </b-col>
    </b-row>
    <hr>
    <div>
      <div class="print-padded">
        <div
          class="col-xs-12 page-header"
          align="center"
        >
          <img
            :src="baseServerUrl +'storage/'+ school.logo"
            alt="School Logo"
            width="200"
          >
          <h4><div class="label label-primary">
            STATEMENT OF ACCOUNT
          </div></h4>
          <label>{{ table_title }}</label>
        </div>
        <table
          v-if="statements.length > 0"
          v-loading="loading"
          class="table table-bordered table-striped"
        >
          <thead>
            <tr>
              <th>REF</th>
              <th>DESCRIPTION</th>
              <th>CREDIT ({{ currency }})</th>
              <th>DEBIT ({{ currency }})</th>
              <th>BALANCE ({{ currency }})</th>
              <th>TRANSACTION DATE</th>
              <th>LOG DATE</th>
            </tr>
          </thead>
          <tbody>

            <tr
              v-for="(statement, index) in statements"
              :key="index"
            >
              <td>{{ statement.ref }}</td>
              <td>{{ statement.purpose }}</td>
              <td><strong>{{ statement.credit.toLocaleString() }}</strong></td>
              <td><strong>{{ statement.debit.toLocaleString() }}</strong></td>
              <td><strong>{{ statement.balance.toLocaleString() }}</strong></td>
              <td>{{ moment(statement.date).format('ll') }}</td>
              <td>{{ moment(statement.log).format('lll') }}</td>
            </tr>
          </tbody>
        </table>
        <el-empty v-else>
          Pick date range to view statement of account
        </el-empty>
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import Resource from '@/api/resource'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          },
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          },
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        }],
      },
      isCreateIncomeSidebarActive: false,
      isEditIncomeSidebarActive: false,
      showApplyFeeModal: false,
      pageLength: 10,
      dir: false,
      statements: [],
      brought_forward: 0,
      running_balance: 0,
      loading: false,
      editable_row: '',
      selected_row_index: '',
      currency: '',

      form: {
        from: '',
        to: '',
      },

      date: [],
      today: new Date(),
      amount_paid: '',
      paying: false,
      table_title: '',
      downloadLoading: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    school() {
      return this.$store.getters.userData.school
    },
  },
  created() {
    // this.fetchAccountStatement()
  },
  methods: {
    moment,
    checkPermission,
    printCard() {
      window.print()
    },
    fetchAccountStatement() {
      const app = this
      app.loading = true
      const param = app.form
      const { date } = app
      param.from = app.moment(date[0]).format('YYYY-MM-DD')
      param.to = app.moment(date[1]).format('YYYY-MM-DD')
      const fetchPaymentsResource = new Resource('account/revenue/statement-of-account')
      fetchPaymentsResource.list(param)
        .then(response => {
          app.statements = response.statements
          app.brought_forward = response.brought_forward
          app.running_balance = app.brought_forward
          const from = response.date_from_formatted
          const to = response.date_to_formatted
          app.currency = response.currency
          app.table_title = `${app.moment(from).format('ll')} to ${app.moment(to).format('ll')}`
          app.loading = false
          app.setRunningTotalArray(app.statements)
        })
    },
    setRunningTotalArray(statements) {
      const app = this
      let { running_balance } = app
      statements.forEach(statement => {
        if (statement.type === 'income') {
          // eslint-disable-next-line camelcase
          running_balance += statement.amount
        } else {
          // eslint-disable-next-line camelcase
          running_balance -= statement.amount
        }
        // eslint-disable-next-line no-param-reassign, camelcase
        statement.balance = running_balance
      })
      app.statements.unshift(
        {
          date: app.moment(app.form.from).format('ll'),
          credit: '',
          debit: '',
          balance: app.brought_forward, // initially set to zero
          ref: '',
          purpose: 'B/F',
        },
      )
    },
    handleDownload(tableTitle, dataList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          // 'ID',
          'REF',
          'DESCRIPTION',
          'CREDIT',
          'DEBIT',
          'BALANCE',
          'TRANSACTION DATE',
          'LOG DATE',
        ]
        const filterVal = [
          // 'studentship_status',
          // 'id',
          'ref',
          'purpose',
          'credit',
          'debit',
          'balance',
          'date',
          'log',
        ]
        const list = dataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv',
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // if (j === 'studentship_status') {
        //   return (v.student.studentship_status === 'left') ? 'WITHDRAWN' : v.student.studentship_status.toUpperCase()
        // }
        if (j === 'date') {
          return this.moment(v.date).format('ll')
        }
        if (j === 'log') {
          return this.moment(v.log).format('lll')
        }

        return v[j]
      }))
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
<style>
  @media print {
    .table > thead > tr > th,
    .table > tbody > tr > th,
    .table > tfoot > tr > th,
    .table > thead > tr > td,
    .table > tbody > tr > td,
    .table > tfoot > tr > td {
      font-size: 1.1rem !important;
    }
  }
</style>
