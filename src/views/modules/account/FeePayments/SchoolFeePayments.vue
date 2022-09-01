<template>
  <div>
    <h3>Fee Payment Log</h3>
    <v-client-table
      v-model="schoolFeePayments"
      v-loading="loading"
      :columns="payment_columns"
      :options="payment_options"
    >
      <div
        slot="amount"
        slot-scope="{row}"
      >
        {{ currency + row.amount.toLocaleString() }}
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          v-if="!checkRole(['student']) && checkPermission(['can approve fees payments']) && props.row.message === 'Pending' && props.row.remitted === 0"
          variant="gradient-success"
          class="btn-icon rounded-circle"
          @click="confirmApproval(props.row)"
        >
          <feather-icon icon="CheckIcon" />
        </b-button>
        <el-tag
          v-if="props.row.message === 'Approved' && props.row.remitted === 1"
          type="success"
          effect="dark"
        >
          Approved
        </el-tag>
        <el-tag
          v-else
          type="danger"
          effect="dark"
        >
          Pending
        </el-tag>
      </div>
    </v-client-table>
  </div>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    schoolFeePayments: {
      type: Array,
      default: () => [],
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      payment_columns: [
        'receipt_no',
        'reference',
        'mode',
        'amount',
        'pay_date',
        'action',
      ],

      payment_options: {
        headings: {
          receipt_no: 'Receipt No.',
          reference: 'REF.',
          mode: 'Mode',
          pay_date: 'Date',
          amount: 'Amount',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        sortable: [
          'pay_date',
        ],
        // filterable: false,
        filterable: [
          'receipt_no',
          'pay_date',
          'reference',
        ],
      },
      levels: [],
      sessions: [],
      terms: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      form: {
        level_id: '',
        sess_id: '',
        term_id: '',
      },
    }
  },
  created() {
  },

  methods: {
    checkRole,
    checkPermission,
    confirmApproval(payment) {
      const app = this
      const message = `You are about to approve the payment of ${app.currency} ${payment.amount} from this student. Click Yes to confirm.`
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
            app.approve(payment)
          }
        })
    },
    approve(payment) {
      const app = this
      const approvePaymentResource = new Resource('account/fee-payments/approve-school-fee')
      approvePaymentResource.update(payment.id)
        .then(() => {
          app.$emit('approve')
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
