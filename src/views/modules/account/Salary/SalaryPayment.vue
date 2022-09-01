<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="9"
        >
          <span
            class="demo-inline-spacing"
          >
            <el-date-picker
              v-model="form.date"
              type="month"
              placeholder="Pick a month"
              :picker-options="pickerOptions"
              @change="fetchPayments()"
            />
            <!-- <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              :disabled="form.date === ''"
              @click="fetchPayments()"
            >
              <span class="align-middle">Fetch Salary Sheet</span>
            </b-button> -->
          </span>
        </b-col>
        <b-col
          cols="3"
        >
          <span
            class="demo-inline-spacing pull-right"
          >
            <b-button
              v-if="checkPermission(['can generate staff salary payment sheet'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-danger"
              :disabled="form.date === ''"
              @click="confirmGeneration()"
            >
              <feather-icon
                icon="CheckIcon"
                class="mr-50"
              />
              <span class="align-middle">Generate Sheet</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <v-client-table
      v-model="salary_payments"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="staff.user"
        slot-scope="{row}"
      >
        <span>{{ row.staff.user.first_name + ' '+ row.staff.user.last_name }}</span><br>
        <span>{{ row.staff.user.username }}</span><br>
      </div>
      <div
        slot="salary"
        slot-scope="{row}"
      >
        {{ currency + row.salary.toLocaleString() }}
      </div>
      <div
        slot="amount_paid"
        slot-scope="props"
      >
        <span>{{ currency + props.row.amount_paid.toLocaleString() }}</span>
      </div>
      <div
        slot="balance"
        slot-scope="props"
      >
        <strong>{{ currency + props.row.balance.toLocaleString() }}</strong>
      </div>
      <div
        slot="date"
        slot-scope="{row}"
      >
        <strong>{{ row.pay_month + ', ' + row.pay_year }}</strong>
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <div v-if="props.row.balance > 0">
          <el-popover
            v-if="checkPermission(['can enter staff salary payment'])"
            placement="right"
            width="400"
            trigger="click"
          >
            <el-input
              v-model="amount_paid"
              placeholder="Enter Amount to pay"
              type="number"
              min="0"
              style="width: 80%;"
            />
            <el-button
              v-loading="paying"
              type="success"
              @click="paySalary(props.row.entry_index, props.row)"
            >
              Pay
            </el-button>
            <el-button
              :id="props.row.id"
              slot="reference"
              type="primary"
              @click="amount_paid = props.row.balance"
            >
              Pay Salary
            </el-button>
          </el-popover>
        </div>
        <el-tag
          v-else
          type="success"
          effect="dark"
        >
          PAID
        </el-tag>
      </div>
    </v-client-table>
    <b-modal
      v-model="showApplyFeeModal"
      title="Apply School Fees to Students"
      hide-footer
    >
      <h5>Pick students' levels you wish to apply their school fees</h5>
      <code>Multiple selection enabled</code><br>
      <b-form-group>
        <el-select
          v-model="form.level_ids"
          style="width: 100%;"
          placeholder="Select Level"
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="(level, index) in levels"
            :key="index"
            :label="level.level"
            :value="level.id"
          />
        </el-select>
      </b-form-group>
      <b-form-group>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1"
          @click="applyFeeToStudent()"
        >
          Submit
        </b-button>
      </b-form-group>
    </b-modal>
    <create-school-fee-settings
      v-if="isCreateClassSidebarActive"
      v-model="isCreateClassSidebarActive"
      :levels="levels"
      :fee-purposes="fee_purposes"
      :currency="currency"
      @save="updateTable"
    />
    <edit-school-fee-settings
      v-if="isEditClassSidebarActive"
      v-model="isEditClassSidebarActive"
      :fee-purposes="fee_purposes"
      :selected-fee-settings="editable_row"
      :currency="currency"
      @update="updateTable"
    />
  </div>
</template>

<script>
import moment from 'moment'
import {
  BButton, BRow, BCol, BModal, BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    BButton,
    BModal,
    BRow,
    BCol,
    BFormGroup,
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
      },
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      showApplyFeeModal: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'staff.user',
        'salary_scale.name',
        'salary',
        'amount_paid',
        'balance',
        'date',
      ],

      options: {
        headings: {
          'staff.user': 'Staff',
          'salary_scale.name': 'Salary Scale',
          amount_paid: 'Paid',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        sortable: [
          'staff.user',
          'salary_scale.name',
        ],
        // filterable: false,
        filterable: [
          'staff.user',
          'salary_scale.name',
        ],
      },
      salary_payments: [],
      levels: [],
      fee_purposes: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      currency: '',

      form: {
        date: '',
        term_id: '',
      },
      today: new Date(),
      amount_paid: '',
      paying: false,
    }
  },
  created() {
    // this.fetchLevels()
    // this.fetchPayments()
  },
  methods: {
    moment,
    checkPermission,
    fetchPayments() {
      const app = this
      app.loading = true
      const param = app.form
      param.date = app.moment(param.date).format('YYYY-MM-DD')
      const fetchPaymentsResource = new Resource('account/salary/payments-monitor')
      fetchPaymentsResource.list(param)
        .then(response => {
          app.salary_payments = response.salary_payments
          app.salary_payments.forEach(payment => {
            const index = app.salary_payments.indexOf(payment)
            // eslint-disable-next-line no-param-reassign
            payment.entry_index = index
          })
          app.currency = response.currency
          app.loading = false
        })
    },
    confirmGeneration() {
      const app = this
      const message = `You are about to generate salary sheet for ${app.moment(app.form.date).format('MMMM, YYYY')}. Click Yes to confirm.`
      app.$bvModal
        .msgBoxConfirm(message, {
          title: 'Confirm Salary Sheet Generation',
          size: 'sm',
          okVariant: 'success',
          okTitle: 'Yes',
          cancelTitle: 'No',
          cancelVariant: 'outline-secondary',
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            app.generatePaymentMonitorTable()
          }
        })
    },
    generatePaymentMonitorTable() {
      const app = this
      app.loading = true
      const param = app.form
      param.date = app.moment(param.date).format('YYYY-MM-DD')
      const fetchPaymentsResource = new Resource('account/salary/prepare-salary-sheet')
      fetchPaymentsResource.store(param)
        .then(response => {
          app.salary_payments = response.salary_payments
          app.currency = response.currency
          app.loading = false
        })
    },
    paySalary(index, row) {
      const app = this
      const amountPaid = this.amount_paid
      app.paying = true
      // const totalAmountPaid = parseFloat(amountPaid + row.amount_paid)
      if (amountPaid > row.balance) {
        app.$alert(`Please DO NOT pay more than ${app.currency}${row.balance.toLocaleString()}`)
      } else {
        const param = { salary_payment_monitor_id: row.id, amount_paid: amountPaid }
        const fetchPaymentsResource = new Resource('account/salary/pay-staff')
        fetchPaymentsResource.store(param)
          .then(() => {
            app.salary_payments[index].amount_paid = parseFloat(app.salary_payments[index].amount_paid + amountPaid)
            app.salary_payments[index].balance = parseFloat(app.salary_payments[index].balance - amountPaid)
            app.amount_paid = ''
            document.getElementById(row.id).click()
            app.paying = false
          }).catch(error => {
            if (error.response) {
              app.$message(error.response.data.message)
            } else {
              app.$message(error.message)
            }
            app.paying = false
          })
      }
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
