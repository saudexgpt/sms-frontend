<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex no-padding"
      >
        <div class="w-100 d-lg-flex">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        v-loading="loading"
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-2"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <div>
            <div
              align="center"
            >
              <img
                src="/images/logo/logo.png"
                alt="logo"
                width="150"
                class="mx-auto"
              >
              <h4>PARTNERSHIP REGISTRATION FORM</h4>
              <router-link to="/login">
                Cancel Action
              </router-link>
            </div>
            <register-partner-form
              @submit="goToLogin"
            />
          </div>
        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol, BImg } from 'bootstrap-vue'
import RegisterPartnerForm from './RegisterPartnerForm.vue'

export default {
  components: {
    // BCard,
    BRow,
    BCol,
    BImg,
    RegisterPartnerForm,
  },
  data() {
    return {
      pin: '',
      loading: false,
      showForm: false,
      formType: '',
      school: '',
      // eslint-disable-next-line global-require
      sideImg: require('@/assets/images/pages/register-v2-dark.svg'),
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    imgUrl() {
      if (this.$store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties, global-require
        this.sideImg = require('@/assets/images/pages/register-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    goToLogin() {
      this.showForm = false
      this.$alert('Your data is submitted. Your account will be activated')
      // window.location = '/login'
      this.$router.push({ path: '/login' })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
