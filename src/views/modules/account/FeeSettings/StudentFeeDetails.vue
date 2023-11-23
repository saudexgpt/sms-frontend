<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="12"
        >
          <h4>{{ selectedFee.student.user.first_name }} {{ selectedFee.student.user.last_name }} ({{ selectedFee.level.level }})</h4>
        </b-col>
      </b-row>
    </div>
    <div v-loading="loading">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Amount</th>
            <th>VAT</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="fee in applicable_fees"
            :key="fee.id"
            style="background: green; color: white"
          >
            <td>{{ fee.purpose }}</td>
            <td>{{ currency + fee.amount.toLocaleString() }}</td>
            <td>{{ currency + fee.vat.toLocaleString() }}</td>
            <td>{{ currency + (parseFloat(fee.amount + fee.vat)).toLocaleString() }}</td>
            <td>Added to fees</td>
            <td>
              <b-button
                v-if="selectedFee.amount_paid < 1"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="danger"
                class="mr-1"
                size="sm"
                @click="setPayableNonPayableFee('remove', fee.id, parseFloat(fee.amount + fee.vat))"
              >
                Click to Remove
              </b-button>
            </td>
          </tr>
          <tr
            v-for="fee2 in non_applicable_fees"
            :key="fee2.id"
            style="background: brown; color: white"
          >
            <td>{{ fee2.purpose }}</td>
            <td>{{ currency + fee2.amount.toLocaleString() }}</td>
            <td>{{ currency + fee2.vat.toLocaleString() }}</td>
            <td>{{ currency + (parseFloat(fee2.amount + fee2.vat)).toLocaleString() }}</td>
            <td>Not added</td>
            <td>
              <b-button
                v-if="selectedFee.amount_paid < 1"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="success"
                class="mr-1"
                size="sm"
                @click="setPayableNonPayableFee('add', fee2.id, parseFloat(fee2.amount + fee2.vat))"
              >
                Click to Add
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedFee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      showApplyFeeModal: false,
      pageLength: 10,
      dir: false,
      columns: [
        'level.level',
        'purpose',
        'amount',
        'vat',
        'total',
        'action',
        // 'is_active',
      ],

      options: {
        headings: {
          'level.level': 'Level',
          'term.name': 'Term',
          vat: 'VAT',
          // is_active: 'Status',
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
          'level.level',
          'purpose',
        ],
        // filterable: false,
        filterable: [
          'level.level',
          'purpose',
        ],
      },
      loading: false,
      selected_row_index: '',
      currency: '',
      applicable_fees: [],
      non_applicable_fees: [],
    }
  },
  created() {
    this.fetchFeeDetails()
  },
  methods: {
    checkPermission,
    fetchFeeDetails() {
      const app = this
      app.loading = true
      const fetchFeeDetailsResource = new Resource('account/fee-settings/view-student-fee-details')
      fetchFeeDetailsResource.get(app.selectedFee.id)
        .then(response => {
          app.applicable_fees = response.applicable_fees
          app.non_applicable_fees = response.non_applicable_fees
          app.currency = response.currency
          app.loading = false
        })
    },
    setPayableNonPayableFee(type, feeId, total) {
      const app = this
      app.loading = true
      const param = { type, fee_id: feeId, total }
      const saveSchoolFeeResource = new Resource('account/fee-settings/set-payable-nonpayable-fee')
      saveSchoolFeeResource.update(app.selectedFee.id, param)
        .then(response => {
          app.applicable_fees = response.applicable_fees
          app.non_applicable_fees = response.non_applicable_fees
          app.loading = false
        }).catch(() => {
          this.$message('An error occured')
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
