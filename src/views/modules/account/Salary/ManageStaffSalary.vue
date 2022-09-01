<template>
  <el-card>
    <b-tabs content-class="mt-1">
      <b-tab>
        <template #title>
          <feather-icon icon="SettingIcon" />
          <span>Manage Salary Scale</span>
        </template>
        <salary-scale />
      </b-tab>
      <b-tab>
        <template #title>
          <feather-icon icon="DollarIcon" />
          <span>Salary Payment</span>
        </template>
        <salary-payment />
      </b-tab>
      <!-- <b-tab>
        <template #title>
          <feather-icon icon="CreditCardIcon" />
          <span>Other Fees</span>
        </template>
        <other-fee-settings />
      </b-tab> -->
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import SalaryScale from './SalaryScale.vue'
import SalaryPayment from './SalaryPayment.vue'
// import OtherFeeSettings from './OtherFeeSettings.vue'

export default {
  components: {
    BTabs,
    BTab,
    SalaryScale,
    SalaryPayment,
    // OtherFeeSettings,
  },
  methods: {
    checkPermission,
    checkRole,
  },
}
</script>
