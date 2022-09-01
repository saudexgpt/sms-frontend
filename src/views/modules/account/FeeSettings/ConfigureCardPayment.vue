<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <b-row>
          <b-col
            cols="12"
          >
            <h4>Enter your Paystack Public Key and click UPDATE</h4>
          </b-col>
        </b-row>
      </div>
      <b-row>

        <!-- first name -->
        <b-col cols="7">
          <el-input
            v-model="paystack_key"
            placeholder="Paste your Paystack key here"
          >
            <!-- <template #append>
              <div @click="toggleVisibility()">
                <feather-icon icon="EyeIcon" />
              </div>
            </template> -->
          </el-input>
        </b-col>
        <!-- submit and reset -->
        <b-col cols="5">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            @click="savePaystackKey()"
          >
            UPDATE
          </b-button>
        </b-col>
      </b-row>
      <div>

        <p><strong>We can help you receive card payments securely via Paystack Gateway</strong></p>
        <img
          src="/images/logo/paystack.png"
          alt="logo"
          width="250"
          class="mx-auto"
        >
      </div>
    </el-card>
  </div>

</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      paystack_key: '',
      loading: false,
      type: 'password',
    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
  },
  created() {
    this.paystack_key = this.school.paystack_key
  },
  methods: {
    savePaystackKey() {
      const app = this
      app.loading = true
      const saveKeyResource = new Resource('account/fee-settings/save-paystack-key')
      saveKeyResource.store({ paystack_key: app.paystack_key })
        .then(() => {
          app.$alert('Key updated successfully')
          app.loading = false
        })
    },
    // toggleVisibility() {
    //   const app = this
    //   if (app.type === 'password') {
    //     app.type = 'text'
    //   } else {
    //     app.type = 'password'
    //   }
    // },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
