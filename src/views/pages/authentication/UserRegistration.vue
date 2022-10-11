<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div
      v-if="!showForm"
      class="auth-inner py-2"
    >

      <!-- Register v1 -->
      <b-card class="mb-0">
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
            label="PIN"
            label-for="pin"
          >
            <b-form-input
              id="pin"
              v-model="pin"
              placeholder="Enter your PIN here..."
            />
          </b-form-group>

          <!-- submit button -->
          <b-button
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
            <span>Sign in instead</span>
          </b-link>
        </b-card-text>
      </b-card>
    <!-- /Register v1 -->
    </div>
    <div
      v-else
      class="app-container"
    >
      <el-card>
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
      </el-card>
    </div>
  </div>

</template>

<script>
import {
  BCard, BLink, BCardTitle, BCardText, BForm,
  BButton, BFormInput, BFormGroup,
} from 'bootstrap-vue'
import StudentRegistrationForm from '@/views/modules/user/students/partials/RegisterWithPin.vue'
import StaffRegistrationForm from '@/views/modules/user/staff/partials/RegisterWithPin.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BLink,
    BCardTitle,
    BCardText,
    BForm,
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
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
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
      this.$alert('Your data is submitted and necessary actions will be taken by the school administrator')
      // window.location = '/login'
      this.$router.push({ path: '/login' })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
