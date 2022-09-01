<template>
  <span
    v-if="amount_in_kobo > 0"
  >
    <paystack
      :amount="amount_in_kobo"
      :email="form.email"
      :paystackkey="paystackKey"
      :reference="reference"
      :callback="callback"
      :close="close"
      :embed="false"
    >
      Pay Via Card
    </paystack>
    <br>
    <br>
    <img
      src="/images/logo/paystack.png"
      alt="logo"
      width="250"
      class="mx-auto"
    >
  </span>
</template>

<script type="text/javascript">
import moment from 'moment'
import paystack from 'vue-paystack'
import Resource from '@/api/resource'

export default {
  components: {
    paystack,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paystackKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // paystackkey: process.env.VUE_APP_MIX_PAYSTACK_API_KEY, // 'pk_test_a32396d591431a2c57e4c68a3cfa8fb15502a4b3', // paystack public key
      payment_response: '',
      subscription_payments: [],
    }
  },
  computed: {
    reference() {
      let text = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      return text
    },
    amount_in_kobo() {
      return parseFloat(this.form.amount * 100)
    },
  },
  methods: {
    moment,
    callback(response) {
      // console.log(response)
      this.payment_response = response
      this.payViaCard()
    },
    close() {
      console.log('Payment closed')
    },

    payViaCard() {
      const app = this
      const param = app.payment_response
      param.student_id = app.form.student_id
      param.fee_payment_monitor_id = app.form.fee_payment_monitor_id
      param.amount = parseFloat(app.form.amount)

      const subscriptionResource = new Resource('account/fee-payments/pay-via-card')
      subscriptionResource.store(param).then(() => {
        app.$emit('paid')
      })
    },
  },
}
</script>
<style type="text/css">
.payButton {
  background-color: #29b263;;
  border-color: #ffffff;;
  padding: 10px;
  border-radius: 20px;
  color:  #fff;
  font-size: 16px;
  margin-top: 10px;
}
</style>
