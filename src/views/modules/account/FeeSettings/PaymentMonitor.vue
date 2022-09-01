<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Make your selections to view payments</h4>
        </b-col>
      </b-row>
    </div>
    <b-row>
      <b-col
        cols="4"
      >
        <el-select
          v-model="form.sess_id"
          style="width: 100%;"
          placeholder="Select Session"
          filterable
          @input="fetchPaymentMonitor(true)"
        >
          <el-option
            v-for="(session, index) in sessions"
            :key="index"
            :label="session.name"
            :value="session.id"
          />
        </el-select>
      </b-col>
      <b-col
        cols="4"
      >
        <el-select
          v-model="form.term_id"
          style="width: 100%;"
          placeholder="Select Term"
          filterable
          @input="fetchPaymentMonitor(true)"
        >
          <el-option
            v-for="(term, index) in terms"
            :key="index"
            :label="term.name"
            :value="term.id"
          />
        </el-select>
      </b-col>
      <b-col
        cols="4"
      >
        <el-select
          v-model="form.level_id"
          style="width: 100%;"
          placeholder="Select Level"
          filterable
          @input="fetchPaymentMonitor(true)"
        >
          <el-option
            label="All"
            value="all"
          />
          <el-option
            v-for="(level, index) in levels"
            :key="index"
            :label="level.level"
            :value="level.id"
          />
        </el-select>
      </b-col>
      <!-- <b-col
        cols="1"
      >
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class="mr-1"
          @click="fetchPaymentMonitor()"
        >
          Fetch
        </b-button>
      </b-col> -->
    </b-row>
    <v-client-table
      v-model="payment_monitors"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <template
        slot="child_row"
        slot-scope="{row}"
      >
        <aside>
          <school-fee-payments
            :currency="currency"
            :school-fee-payments="row.school_fee_payments"
            @approve="fetchPaymentMonitor(false)"
          />
        </aside>
      </template>
      <div
        slot="student"
        slot-scope="{row}"
      >
        <strong>{{ row.student.user.first_name + ' ' + row.student.user.last_name }}</strong><br>
        <span>{{ row.student.registration_no }}</span>
      </div>
      <div
        slot="total_fee"
        slot-scope="{row}"
      >

        <el-tag
          type="info"
          effect="dark"
        >
          {{ currency + row.total_fee.toLocaleString() }}
        </el-tag>
      </div>
      <div
        slot="amount_paid"
        slot-scope="{row}"
      >
        <el-tag
          type="success"
          effect="dark"
        >
          {{ currency + row.amount_paid.toLocaleString() }}
        </el-tag>
      </div>
      <div
        slot="balance"
        slot-scope="{row}"
      >
        <el-tag
          type="danger"
          effect="dark"
        >
          {{ currency + (parseFloat(row.total_fee - row.amount_paid)).toLocaleString() }}
        </el-tag>
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          content="View Fee Breakdown"
          placement="top"
        >
          <b-button
            variant="gradient-info"
            class="btn-icon rounded-circle"
            @click="showFeeDetails(props.row)"
          >
            <feather-icon icon="FileTextIcon" />
          </b-button>
        </el-tooltip>
      </div>
    </v-client-table>
    <b-modal
      v-model="showModal"
      title="Student Fee Break Down"
      centered
      size="lg"
      hide-footer
    >

      <student-fee-details :selected-fee="selected_fee" />

    </b-modal>
  </div>
</template>

<script>
import {
  BRow, BCol, BModal, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import SchoolFeePayments from '../FeePayments/SchoolFeePayments.vue'
import StudentFeeDetails from './StudentFeeDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BModal,
    BRow,
    BCol,
    BButton,
    SchoolFeePayments,
    StudentFeeDetails,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      showModal: false,
      selected_fee: null,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'student',
        'level.level',
        // 'session.name',
        // 'term.name',
        'total_fee',
        'amount_paid',
        'balance',
      ],

      options: {
        headings: {
          'level.level': 'Level',
          'session.name': 'Session',
          'term.name': 'Term',
          vat: 'VAT',
          // assign: 'Assign TO',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        sortable: [
          'student',
          'level.level',
          // 'term.name',
          // 'session.name',
        ],
        // filterable: false,
        filterable: [
          'student',
          'level.level',
          // 'term.name',
          // 'session.name',
        ],
      },
      payment_monitors: [],
      levels: [],
      sessions: [],
      terms: [],
      loading: false,
      selected_row_index: '',
      currency: '',
      form: {
        level_id: '',
        sess_id: '',
        term_id: '',
      },
    }
  },
  created() {
    this.fetchLevels()
    this.fetchSessionAndTerms()
  },

  methods: {
    checkPermission,
    fetchSessionAndTerms() {
      const app = this
      const fetchLevelsResource = new Resource('school-setup/fetch-session-and-term')
      fetchLevelsResource.list()
        .then(response => {
          app.terms = response.terms
          app.sessions = response.sessions
        })
    },
    fetchLevels() {
      const app = this
      const fetchLevelsResource = new Resource('school-setup/levels')
      fetchLevelsResource.list()
        .then(response => {
          app.levels = response.levels
        })
    },
    fetchPaymentMonitor(load) {
      const app = this
      const param = app.form
      if (param.level_id === '' || param.sess_id === '' || param.term_id === '') {
        return
      }
      app.loading = load
      const fetchPaymentMonitorResource = new Resource('account/fee-payments/monitor-table')
      fetchPaymentMonitorResource.list(param)
        .then(response => {
          app.payment_monitors = response.payment_monitors
          app.currency = response.currency
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchSchoolFeeSettings()
    },
    showFeeDetails(value) {
      // console.log(props)
      const app = this
      app.selected_fee = value
      app.showModal = true
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
