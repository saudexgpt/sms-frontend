<template>
  <div v-loading="loader">

    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="circle"
      step-size="xs"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="wizard-vertical mb-3"
      @on-complete="formSubmitted"
    >
      <!-- Admission details tab -->
      <tab-content
        title="Contact Information"
        :before-change="validationFormContact"
      >
        <validation-observer
          ref="administratorRules"
          tag="form"
        >
          <b-row>
            <b-col md="12">
              <b-form-group
                label="First Name"
                label-for="first_name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="First Name"
                  rules="required"
                >
                  <b-form-input
                    id="first_name"
                    v-model="form.first_name"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Last Name"
                label-for="last_name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Last Name"
                  rules="required"
                >
                  <b-form-input
                    id="last_name"
                    v-model="form.last_name"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Email"
                label-for="email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="email"
                    v-model="form.email"
                    :state="errors.length > 0 ? false:null"
                    type="email"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                  <!-- <small class="text-primary"><strong>On successful registration a notification will be sent to this e-mail</strong></small> -->
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Gender"
                label-for="gender"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Gender"
                  rules="required"
                >

                  <el-select
                    v-model="form.gender"
                    style="width: 100%;"
                    placeholder="Select Gender"
                  >
                    <el-option
                      v-for="(gender, index) in genders"
                      :key="index"
                      :label="gender"
                      :value="gender"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Primay Phone Number"
                label-for="phone"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Primay Phone Number"
                  rules="required|integer:min:11|integer:max:11"
                >
                  <b-form-input
                    id="phone"
                    v-model="form.phone1"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Enter Phone Number"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Alternative Mobile Number"
                label-for="phone2"
                rules="integer:min:11|integer:max:11"
              >
                <b-form-input
                  id="phone2"
                  v-model="form.phone2"
                  placeholder="Enter Alternative Phone Number"
                />
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Residential Address"
                label-for="address"
                rules="required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Residential Address"
                  rules="required"
                >
                  <b-form-textarea
                    id="address"
                    v-model="form.address"
                    placeholder="Residential Address"
                  /><small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

          </b-row>
        </validation-observer>
      </tab-content>
      <tab-content
        title="Login Credentials"
        :before-change="validationFormCredentials"
      >
        <validation-observer
          ref="loginCredentialRules"
          tag="form"
        >
          <b-row>
            <b-col md="12">
              <b-form-group
                label="Username"
                label-for="username"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Username"
                  rules="required"
                >
                  <b-form-input
                    id="username"
                    v-model="form.username"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Password"
                label-for="password"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required|password"
                >
                  <b-form-input
                    id="password"
                    v-model="form.password"
                    :state="errors.length > 0 ? false:null"
                    type="password"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Confirm Password"
                label-for="cpassword"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
                >
                  <b-form-input
                    id="cpassword"
                    v-model="form.cpassword"
                    :state="errors.length > 0 ? false:null"
                    type="password"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  // BAlert,
} from 'bootstrap-vue'
import {
  required, email, confirmed, password,
} from '@validations'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    // BAlert,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      required,
      password,
      email,
      confirmed,

      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone2: '',
        phone1: '',
        gender: '',
        address: '',
        username: '',
        password: '',
        cpassword: '',
        role: 11, // role_id of marketer
      },
      empty_form: {
        first_name: '',
        last_name: '',
        email: '',
        phone2: '',
        phone1: '',
        gender: '',
        address: '',
        username: '',
        password: '',
        cpassword: '',
        role: 11, // role_id of marketer

      },
      // codeIcon,
      genders: ['Male', 'Female'],
      loader: false,
    }
  },
  created() {
    // this.fetchFormDetails()
  },
  methods: {
    // onContext(ctx) {
    //   // The date formatted in the locale, or the `label-no - date - selected` string
    //   this.formatted = ctx.selectedFormatted
    //   // The following will be an empty string until a valid date is entered
    //   this.selected = ctx.selectedYMD
    // },
    // fetchFormDetails() {
    //   const app = this
    //   const fetchCurriculumSetupResource = new Resource('school/create')
    //   fetchCurriculumSetupResource.list()
    //     .then(response => {
    //       app.countries = response.countries
    //       app.selectedCountry = response.selected_country
    //       // app.levels = response.levels
    //       // app.form.registration_no = response.reg_no
    //       // app.form.username = response.parent_username
    //       // app.admission_sessions = response.admission_sessions
    //       app.setState()
    //     })
    // },
    // setState() {
    //   const app = this
    //   app.lgas = []
    //   app.states = app.selectedCountry.states
    // },
    // setLgas() {
    //   const app = this
    //   app.lgas = app.selectedState.lgas
    // },
    // setClass() {
    //   const app = this
    //   app.classes = app.selectedLevel.class_teachers
    // },
    formSubmitted() {
      const app = this
      const registerSchoolResource = new Resource('partners/register')
      const { form } = app
      app.loader = true
      registerSchoolResource.store(form)
        .then(() => {
          app.form = app.empty_form
          app.loader = false

          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Successful Registration',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
          app.$emit('submit')
          // send mail
        }).catch(error => {
          console.log(error)
          app.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.message,
              icon: 'XOctagonIcon',
              variant: 'danger',
            },
          })

          app.loader = false
        })
    },
    validationFormContact() {
      return new Promise((resolve, reject) => {
        this.$refs.administratorRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormCredentials() {
      return new Promise((resolve, reject) => {
        this.$refs.loginCredentialRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
