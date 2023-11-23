<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isPaymentSideBarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-payment-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create School Fees
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="load">
            <b-col cols="12">
              <strong>All fields are required</strong>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Enter Amount"
              >
                <el-input
                  v-model="form.amount"
                  type="number"
                  placeholder="Enter Amount"
                >
                  <template #prepend>
                    {{ currency }}
                  </template>
                </el-input>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Fee Purpose"
              >
                <el-input
                  v-model="form.purpose"
                  disabled
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Payment Mode"
              >
                <el-select
                  v-model="form.mode"
                  style="width: 100%;"
                  placeholder="Select Payment Mode"
                >
                  <el-option
                    label="Cash/Bank Deposit"
                    value="cash"
                  />
                  <el-option
                    label="Card"
                    value="card"
                    :disabled="paystackkey === '' || paystackkey === null"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.mode === 'card'"
              cols="12"
            >
              <b-form-group
                label="Enter a valid email that this payment details will be sent to"
              >
                <el-input
                  v-model="form.email"
                  placeholder="Enter Email"
                  type="email"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.mode === 'cash'"
              cols="12"
            >
              <b-form-group
                label="Teller/Receipt No."
              >
                <el-input
                  v-model="form.receipt_no"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-button
                v-if="form.mode === 'cash'"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="success"
                class="mr-1"
                @click="confirmSubmitCashPayment()"
              >
                Submit
              </b-button>
              <card-payment
                v-if="form.mode === 'card' && validEmail(form.email) && paystackkey !== null"
                :form="form"
                :currency="currency"
                :paystack-key="paystackkey"
                @paid="cardPaymentMade"
              />
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import CardPayment from './CardPayment.vue'
import Resource from '@/api/resource'

import { validEmail } from '@/utils/validate'

export default {
  components: {
    // vSelect,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
    CardPayment,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isPaymentSideBarActive',
    event: 'update:is-payment-sidebar-active',
  },
  props: {
    isPaymentSideBarActive: {
      type: Boolean,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        purpose: 'School Fee Payment',
        amount: 0,
        email: '',
        mode: 'cash',
        receipt_no: '',
        student_id: '',
        fee_payment_monitor_id: '',

      },
      load: false,
    }
  },
  computed: {
    paystackkey() {
      return this.$store.getters.userData.school.paystack_key
    },
  },
  created() {
    this.setFormParms()
  },
  methods: {
    validEmail,
    setFormParms() {
      const app = this
      app.form.amount = parseFloat(app.details.total_fee - app.details.amount_paid)
      app.form.student_id = app.details.student_id
      app.form.fee_payment_monitor_id = app.details.id
    },
    continueWithCardPayment() {
      const app = this
      app.form.vat = (app.vat_percentage * app.form.amount) / 100
    },
    aFieldIsEmpty() {
      const app = this
      return app.form.amount < 1 || app.form.amount === null || (app.form.receipt_no === '' && app.form.mode === 'cash') || (app.form.email === '' && app.form.mode === 'card')
    },
    confirmSubmitCashPayment() {
      const app = this

      if (app.aFieldIsEmpty()) {
        app.$alert('Kindly fill all empty fields and ensure the amount is not zero')
        return
      }
      const message = `Do you confirm that the sum of ${app.currency} ${app.form.amount} has been paid?`
      app.$bvModal
        .msgBoxConfirm(message, {
          title: 'Confirm Payment',
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
            app.submitCash()
          }
        })
    },
    submitCash() {
      const app = this
      const paySchoolFeeResource = new Resource('account/fee-payments/pay-via-cash')
      const param = app.form
      app.load = true
      paySchoolFeeResource.store(param)
        .then(() => {
          app.$alert('Payment has been logged and is awaiting approval.')
          app.$emit('save')
          app.$emit('update:is-payment-sidebar-active', false)
          app.load = false
        }).catch(() => {
          app.load = false
          app.$message('An error occured')
        })
    },
    cardPaymentMade() {
      const app = this
      app.$emit('save')
      app.$emit('update:is-payment-sidebar-active', false)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
