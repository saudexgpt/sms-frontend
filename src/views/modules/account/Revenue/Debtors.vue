<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Select level to view debtors</h4>
        </b-col>
      </b-row>
    </div>
    <b-row>
      <!-- <b-col
        cols="4"
      >
        <el-select
          v-model="form.sess_id"
          style="width: 100%;"
          placeholder="Select Session"
          filterable
          @input="fetchDebtors(true)"
        >
          <el-option
            v-for="(session, index) in sessions"
            :key="index"
            :label="session.name"
            :value="session.id"
          />
        </el-select>
      </b-col> -->
      <b-col
        cols="4"
      >
        <el-select
          v-model="form.level_id"
          style="width: 100%;"
          placeholder="Select Level"
          filterable
          @input="fetchDebtors(true)"
        >
          <!-- <el-option
            label="All"
            value="all"
          /> -->
          <el-option
            v-for="(level, index) in levels"
            :key="index"
            :label="level.level"
            :value="level.id"
          />
        </el-select>
      </b-col>
    </b-row>
    <legend v-if="debtors.length > 0">
      Click on the <strong>+</strong> sign to view debt history
    </legend>
    <v-client-table
      v-model="debtors"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <template
        slot="child_row"
        slot-scope="{row}"
      >
        <aside>
          <h3>Debt history for {{ row.user.first_name + ' ' + row.user.last_name }}</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Term</th>
                <th>Level</th>
                <th>Total Fee</th>
                <th>Amount Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(debt_detail, index) in row.fee_payment_monitor"
                :key="index"
              >
                <td>{{ debt_detail.session.name }}</td>
                <td>{{ debt_detail.term.name }}</td>
                <td>{{ debt_detail.level.level }}</td>
                <td>{{ currency + debt_detail.total_fee.toLocaleString() }}</td>
                <td>{{ currency + debt_detail.amount_paid.toLocaleString() }}</td>
                <td>{{ currency + (parseFloat(debt_detail.total_fee - debt_detail.amount_paid)).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </aside>
      </template>
      <div
        slot="user"
        slot-scope="{row}"
      >
        <strong>{{ row.user.first_name + ' ' + row.user.last_name }}</strong><br>
        <span>{{ row.registration_no }}</span>
      </div>
      <div
        slot="total_debt"
        slot-scope="{row}"
      >

        <el-tag
          type="danger"
          effect="dark"
        >
          {{ currency + row.total_debt.toLocaleString() }}
        </el-tag>
      </div>
    </v-client-table>
    <!-- <b-modal
      v-model="showModal"
      title="Student Fee Break Down"
      centered
      size="lg"
      hide-footer
    >

      <student-fee-details :selected-fee="selected_fee" />

    </b-modal> -->
  </div>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import Resource from '@/api/resource'

export default {
  components: {
    // BModal,
    BRow,
    BCol,
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
        // 'action',
        'user',
        'class',
        'total_debt',
      ],
      options: {
        headings: {
          user: 'Debtor',
          class: 'Class',
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
          'user',
          'class',
          // 'term.name',
          // 'session.name',
        ],
        // filterable: false,
        filterable: [
          'user',
          'class',
          // 'term.name',
          // 'session.name',
        ],
      },
      debtors: [],
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
    // this.fetchSessionAndTerms()
  },

  methods: {
    checkPermission,
    // fetchSessionAndTerms() {
    //   const app = this
    //   const fetchLevelsResource = new Resource('school-setup/fetch-session-and-term')
    //   fetchLevelsResource.list()
    //     .then(response => {
    //       app.terms = response.terms
    //       app.sessions = response.sessions
    //     })
    // },
    fetchLevels() {
      const app = this
      const fetchLevelsResource = new Resource('school-setup/levels')
      fetchLevelsResource.list()
        .then(response => {
          app.levels = response.levels
        })
    },
    fetchDebtors(load) {
      const app = this
      // const param = app.form
      // if (param.level_id === '' || param.sess_id === '' || param.term_id === '') {
      //   return
      // }
      app.loading = load
      const fetchDebtorsResource = new Resource('account/fee-payments/debtors-list')
      fetchDebtorsResource.get(app.form.level_id)
        .then(response => {
          app.debtors = response.debtors
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
