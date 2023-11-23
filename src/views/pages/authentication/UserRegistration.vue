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
          <div
            v-if="!showForm"
          >
            <b-card-title
              class="mb-1 font-weight-bold"
              title-tag="h2"
              align="center"
            >
              <img
                src="/images/lock.png"
                alt="logo"
                width="150"
                class="mx-auto"
              >
            </b-card-title>

            <!-- Register v1 -->
            <div
              class="mb-0"
              align="center"
            >
              <b-card-title class="mb-1">
                Enter your Registration PIN
              </b-card-title>
              <b-card-text class="mb-2">
                If you do not have a PIN, contact your school administrator
              </b-card-text>

              <!-- form -->
              <b-form
                class="auth-register-form mt-2"
                @submit.prevent="confirmPin"
              >
                <!-- username -->
                <b-form-group
                  label=""
                  label-for="pin"
                >
                  <b-form-input
                    id="pin"
                    v-model="pin"
                    class="round"
                    placeholder="Enter your PIN here..."
                  />
                </b-form-group>

                <!-- submit button -->
                <b-button
                  pill
                  variant="primary"
                  block
                  type="submit"
                >
                  Continue
                </b-button>
              </b-form>

              <b-card-text class="text-center mt-2">
                <span>Already have an account? </span>
                <b-link :to="{name:'page-login'}">
                  <span>Log in</span>
                </b-link>
              </b-card-text>
            </div>
            <!-- /Register v1 -->
          </div>
          <div
            v-else
          >
            <div
              align="center"
            >
              <img
                align="center"
                :src="baseServerUrl +'storage/'+ school.logo"
                alt="logo"
                width="200"
              >
              <h3>{{ formType.toUpperCase() }} REGISTRATION FORM</h3>
              <router-link to="/login">
                Cancel Action
              </router-link>
            </div>
            <student-registration-form
              v-if="formType === 'student'"
              :school="school"
              :pin="pin"
              @submit="goToLogin"
            />
            <staff-registration-form
              v-if="formType === 'staff'"
              :school="school"
              :pin="pin"
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
import {
  BLink, BCardTitle, BCardText, BForm,
  BButton, BFormInput, BFormGroup, BRow, BCol, BImg,
} from 'bootstrap-vue'
import StudentRegistrationForm from '@/views/modules/user/students/partials/RegisterWithPin.vue'
import StaffRegistrationForm from '@/views/modules/user/staff/partials/RegisterWithPin.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // BCard,
    BRow,
    BCol,
    BLink,
    BCardTitle,
    BCardText,
    BForm,
    BImg,
    BButton,
    BFormInput,
    BFormGroup,
    StudentRegistrationForm,
    StaffRegistrationForm,
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
    confirmPin() {
      const app = this
      if (app.pin !== '') {
        app.loading = true
        const confirmPinResource = new Resource('confirm-pin')
        confirmPinResource.list({ pin: app.pin })
          .then(response => {
            if (response.fetched_pin !== null) {
              app.$message('PIN confirmed')
              app.actOnPin(response.fetched_pin)
            } else {
              app.$alert('Invalid PIN')
            }
            app.loading = false
          }).catch(error => {
            app.$message(error)
            app.loading = false
          })
      } else {
        app.$alert('Please provide a valid registration pin')
      }
    },
    actOnPin(pin) {
      this.formType = pin.pin_type
      this.school = pin.school
      this.pin = pin.id
      this.showForm = true
    },
    goToLogin() {
      this.showForm = false
      this.$alert('Your data is submitted. The school administrator will activate your account.')
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
