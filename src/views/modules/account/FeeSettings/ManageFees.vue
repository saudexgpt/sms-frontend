<template>
  <el-card>
    <b-tabs content-class="mt-1">
      <b-tab v-if="checkPermission(['can view fees settings'])">
        <template #title>
          <feather-icon icon="CreditCardIcon" />
          <span>School Fees</span>
        </template>
        <school-fee-settings />
      </b-tab>
      <b-tab v-if="checkPermission(['can update paystack payment key']) || checkRole(['admin'])">
        <template #title>
          <feather-icon icon="KeyIcon" />
          <span>Configure Card Payment Details</span>
        </template>
        <configure-card-payment />
      </b-tab>
      <b-tab
        v-if="checkPermission(['can view fees payments'])"
      >
        <template #title>
          <feather-icon icon="CreditCardIcon" />
          <span>Fee Payment Table</span>
        </template>
        <payment-monitor />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import SchoolFeeSettings from './SchoolFeeSettings.vue'
import PaymentMonitor from './PaymentMonitor.vue'
import ConfigureCardPayment from './ConfigureCardPayment.vue'
// import OtherFeeSettings from './OtherFeeSettings.vue'

export default {
  components: {
    BTabs,
    BTab,
    SchoolFeeSettings,
    ConfigureCardPayment,
    PaymentMonitor,
  },
  methods: {
    checkPermission,
    checkRole,
  },
}
</script>
