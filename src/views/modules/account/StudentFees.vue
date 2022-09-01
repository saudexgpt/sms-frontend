<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h3>School Fees Table</h3>
        </b-col>
      </b-row>
    </div>
    <b-row>
      <!-- <b-col
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
            v-for="(level, index) in levels"
            :key="index"
            :label="level.level"
            :value="level.id"
          />
        </el-select>
      </b-col> -->
      <b-col
        cols="4"
      >
        <h4>Pick a session to view your fees</h4>
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
        v-if="guardian"
        cols="4"
      >
        <h4>Pick a Child</h4>
        <el-select
          v-model="form.student_id"
          style="width: 100%;"
          placeholder="Select Term"
          filterable
          @input="fetchPaymentMonitor(true)"
        >
          <el-option
            v-for="(guardian_student, index) in guardian_students"
            :key="index"
            :label="guardian_student.student.user.first_name +' ' + guardian_student.student.user.last_name"
            :value="guardian_student.student_id"
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
    <el-alert
      :closable="false"
      type="success"
    >
      Click on the + sign on each row to view payment details
    </el-alert>
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
        {{ currency + row.total_fee.toLocaleString() }}
      </div>
      <div
        slot="amount_paid"
        slot-scope="{row}"
      >
        {{ currency + row.amount_paid.toLocaleString() }}
      </div>
      <div
        slot="balance"
        slot-scope="{row}"
      >
        {{ currency + (parseFloat(row.total_fee - row.amount_paid)).toLocaleString() }}
      </div>
      <div
        slot="action"
        slot-scope="{row}"
      >
        <b-button
          v-if="parseFloat(row.total_fee - row.amount_paid) > 0 && (checkPermission(['can pay fees']) || checkRole(['parent']))"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="gradient-primary"
          @click="makePayment(row)"
        >
          <span class="align-middle">Make Payment</span>
        </b-button>
        <el-tag
          v-else
          type="success"
          effect="dark"
        >
          Paid
        </el-tag>
      </div>
    </v-client-table>
    <make-payment
      v-if="isPaymentSideBarActive"
      v-model="isPaymentSideBarActive"
      :details="details"
      :currency="currency"
      @save="updateTable"
    />
  </el-card>
</template>

<script>
import {
  BRow, BCol, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import SchoolFeePayments from './FeePayments/SchoolFeePayments.vue'
import MakePayment from './FeePayments/partials/MakePayment.vue'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
    SchoolFeePayments,
    MakePayment,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isPaymentSideBarActive: false,
      details: null,
      pageLength: 10,
      dir: false,
      columns: [
        'student',
        'level.level',
        // 'session.name',
        'term.name',
        'total_fee',
        'amount_paid',
        'balance',
        'action',
      ],

      options: {
        headings: {
          'level.level': 'Level',
          'session.name': 'Session',
          'term.name': 'Term',
          vat: 'VAT',
          // assign: 'Assign TO',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          // 'student',
          // 'level.level',
          'term.name',
          // 'session.name',
        ],
        // filterable: false,
        filterable: false,
      },
      payment_monitors: [],
      levels: [],
      sessions: [],
      terms: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      currency: '',
      form: {
        student_id: '',
        sess_id: '',
        // term_id: '',
      },
      guardian_students: [],
    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
    guardian() {
      return this.$store.getters.userData.guardian
    },
  },
  created() {
    if (this.guardian) {
      this.getGuardian(this.guardian.id)
    }
    this.form.sess_id = this.school.current_session.id
    this.fetchSessionAndTerms()
    this.fetchPaymentMonitor(true)
  },

  methods: {
    checkPermission,
    checkRole,
    getGuardian(id) {
      const guardianResource = new Resource('user-setup/guardian/show')
      guardianResource.get(id).then(response => {
        this.guardian_students = response.guardian.guardian_students
        this.can_edit = response.can_edit
        this.loader = false
      })
    },
    fetchSessionAndTerms() {
      const app = this
      const fetchLevelsResource = new Resource('school-setup/fetch-session-and-term')
      fetchLevelsResource.list()
        .then(response => {
          app.terms = response.terms
          app.sessions = response.sessions
        })
    },
    fetchPaymentMonitor(load) {
      const app = this
      const param = app.form
      if (param.sess_id === '') {
        return
      }
      if (this.guardian && param.student_id === '') {
        return
      }
      app.loading = load
      const fetchPaymentMonitorResource = new Resource('account/fee-payments/students-table')
      fetchPaymentMonitorResource.list(param)
        .then(response => {
          app.payment_monitors = response.payment_monitors
          app.currency = response.currency
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchPaymentMonitor()
    },
    makePayment(value) {
      // console.log(props)
      const app = this
      app.details = value
      app.isPaymentSideBarActive = true
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
