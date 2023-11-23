<template>
  <el-card>
    <div
      slot="header"
      class="clearfix"
    >
      <span
        class="pull-right"
      >
        <b-button
          v-if="checkPermission(['can create income and expenses'])"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="gradient-primary"
          @click="isCreateIncomeSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Add New</span>
        </b-button>
      </span>
      <span><h3>Income & Expenses</h3></span>
    </div>
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
            @change="fetchIncomeExpenses()"
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
    </b-row>
    <v-client-table
      v-model="income_expenses"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="user"
        slot-scope="{row}"
      >
        <span>{{ row.user.first_name + ' '+ row.user.last_name }}</span><br>
        <span>{{ row.user.username }}</span><br>
      </div>
      <div
        slot="amount"
        slot-scope="{row}"
      >
        <el-tag
          v-if="row.status === 'income'"
          type="success"
        >
          {{ currency + row.amount.toLocaleString() }}
        </el-tag>
        <el-tag
          v-if="row.status === 'expenses'"
          type="danger"
        >
          {{ currency + row.amount.toLocaleString() }}
        </el-tag>
      </div>
      <div
        slot="date"
        slot-scope="{row}"
      >
        <strong>{{ moment(row.date).format('ll') }}</strong>
      </div>
      <div
        slot="created_at"
        slot-scope="{row}"
      >
        <strong>{{ moment(row.created_at).format('lll') }}</strong>
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <span
          v-if="props.row.deletable === '1'"
        >
          <el-tooltip
            content="Approve Entry"
            placement="top"
          >
            <b-button
              v-if="checkPermission(['can approve income and expenses'])"
              variant="gradient-success"
              class="btn-icon rounded-circle"
              @click="approve(props.index, props.row)"
            >
              <feather-icon icon="CheckIcon" />
            </b-button>
          </el-tooltip>
          <el-tooltip
            content="Delete Entry"
            placement="top"
          >
            <b-button
              v-if="checkPermission(['can create income and expenses'])"
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              @click="deleteRow(props.index, props.row)"
            >
              <feather-icon icon="TrashIcon" />
            </b-button>
          </el-tooltip>
        </span>
        <span v-else>
          <el-tag
            type="success"
            effect="dark"
          >
            Approved
          </el-tag>
        </span>
      </div>
    </v-client-table>
    <create-income-expenses
      v-if="isCreateIncomeSidebarActive"
      v-model="isCreateIncomeSidebarActive"
      :students="students"
      :staff="staff"
      :currency="currency"
      @save="updateTable"
    />
  </el-card>
</template>

<script>
import moment from 'moment'
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import CreateIncomeExpenses from './CreateIncomeExpenses.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    BButton,
    BRow,
    BCol,
    CreateIncomeExpenses,
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
      isCreateIncomeSidebarActive: false,
      isEditIncomeSidebarActive: false,
      showApplyFeeModal: false,
      pageLength: 10,
      dir: false,
      columns: [
        // 'id',
        'action',
        'purpose',
        'status',
        'amount',
        'user',
        'date',
        'created_at',
      ],

      options: {
        headings: {
          purpose: 'Description',
          user: 'Concerned User',
          action: 'Status',
          created_at: 'Logged At',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        sortable: [
          'date',
        ],
        // filterable: false,
        filterable: [
          'user',
          'purpose',
          'date',
          'status',
        ],
      },
      income_expenses: [],
      students: [],
      staff: [],
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
    this.getExpensesRecipient()
    // this.fetchIncomeExpenses()
  },
  methods: {
    moment,
    checkPermission,
    fetchIncomeExpenses() {
      const app = this
      app.loading = true
      const param = app.form
      param.date = app.moment(param.date).format('YYYY-MM-DD')
      const fetchPaymentsResource = new Resource('account/revenue/income-expenses')
      fetchPaymentsResource.list(param)
        .then(response => {
          app.income_expenses = response.income_expenses
          app.currency = response.currency
          app.loading = false
        })
    },
    getExpensesRecipient() {
      const app = this
      const expensesRecipientsResource = new Resource('account/revenue/expenses-recipients')
      expensesRecipientsResource.list()
        .then(response => {
          app.students = response.students
          app.staff = response.staff
          app.currency = response.currency
        })
    },
    updateTable() {
      const app = this
      app.fetchIncomeExpenses()
    },
    approve(index, row) {
      const app = this
      const message = 'Are you sure you want to approve this entry? Click YES to confirm'
      app.$bvModal
        .msgBoxConfirm(message, {
          title: 'Confirm Approval',
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
            app.loading = true
            const deleteRevenueResource = new Resource('account/revenue/approve-income-expenses')
            deleteRevenueResource.update(row.id)
              .then(response => {
                app.income_expenses[index - 1].deletable = response.income_expense.deletable
                app.loading = false
              })
          }
        })
    },
    deleteRow(index, row) {
      const app = this
      const message = 'Are you sure you want to delete this entry? Click YES to confirm'
      app.$bvModal
        .msgBoxConfirm(message, {
          title: 'Confirm Delete Action',
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
            app.loading = true
            const deleteRevenueResource = new Resource('account/revenue/delete-income-expenses')
            deleteRevenueResource.destroy(row.id)
              .then(() => {
                app.income_expenses.splice(index - 1, 1)
                app.loading = false
              })
          }
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
