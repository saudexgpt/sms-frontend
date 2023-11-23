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
      <!-- personal details tab -->
      <tab-content
        title="Personal Details"
        :before-change="validationFormInfo"
      >
        <validation-observer
          ref="infoRules"
          tag="form"
        >
          <b-row>
            <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0">
                Personal Information
              </h5>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Surname"
                label-for="last-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Surname"
                  rules="required"
                >
                  <b-form-input
                    id="last-name"
                    v-model="form.last_name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Enter Surname"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Other Names"
                label-for="first-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Other Names"
                  rules="required"
                >
                  <b-form-input
                    id="first-name"
                    v-model="form.first_name"
                    placeholder="Enter other names"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <validation-provider
                #default="{ errors }"
                name="Country"
                rules="required"
              >
                <b-form-group
                  label="Country"
                  label-for="country"
                  :state="errors.length > 0 ? false:null"
                >
                  <v-select
                    id="country"
                    v-model="selectedCountry"
                    :options="countries"
                    label="country_name"
                    @input="setState()"
                  />
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col
              v-if="states.length > 0"
              md="12"
            >
              <validation-provider
                #default="{ errors }"
                name="State of Origin"
                rules="required"
              >
                <b-form-group
                  label="State of Origin"
                  label-for="state"
                  :state="errors.length > 0 ? false:null"
                >
                  <v-select
                    id="state"
                    v-model="selectedState"
                    :options="states"
                    label="name"
                    @input="setLgas()"
                  />
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col
              v-if="lgas.length > 0"
              md="12"
            >
              <validation-provider
                #default="{ errors }"
                name="LGA"
                rules="required"
              >
                <b-form-group
                  label="LGA of Origin"
                  label-for="lga"
                  :state="errors.length > 0 ? false:null"
                >
                  <v-select
                    id="lga"
                    v-model="selectedLGA"
                    :options="lgas"
                    label="name"
                    @input="setLgas()"
                  />
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="DOB (YYYY-MM-DD)"
                label-for="dob"
              >
                <validation-provider
                  #default="{ errors }"
                  name="DOB"
                  rules="regex:^\d{4}-\d{2}-\d{2}$"
                >

                  <!-- <b-form-datepicker
                    id="dob"
                    v-model="form.dob"
                    placeholder="Choose a date"
                    local="en"
                    :max="max"
                  /> -->
                  <b-input-group class="mb-1">
                    <b-form-input
                      id="dob"
                      v-model="form.dob"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      show-decade-nav
                    />
                    <b-input-group-append>
                      <b-form-datepicker
                        v-model="form.dob"
                        show-decade-nav
                        button-only
                        right
                        locale="en-US"
                        aria-controls="dob"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
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
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- Contact  -->
      <tab-content
        title="Contact Details"
        :before-change="validationFormSponsor"
      >
        <validation-observer
          ref="sponsorRules"
          tag="form"
        >
          <b-row>
            <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0">
                Contact Details
              </h5>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Main Mobile Number"
                label-for="phone1"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Main Phone Number"
                  rules="required|integer:min:11|integer:max:11"
                >
                  <b-form-input
                    id="phone1"
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
                    placeholder="Email"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Residential Address"
                label-for="address"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <b-form-input
                    id="address"
                    v-model="form.address"
                    placeholder="Enter residential address"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
      <tab-content
        title="Received Documents"
      >
        <b-row>
          <b-col
            cols="12"
            class="mb-2"
          >
            <h5 class="mb-0">
              Tick All Submitted Documents
            </h5>
          </b-col>
          <b-col md="12">
            <b-form-group label="">
              <b-form-checkbox
                v-model="form.is_cv_submitted"
                :value="true"
                name="flavour-3a"
              >
                Resume/Curriculum Vitae
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_edu_cert_submitted"
                :value="true"
                name="flavour-3a"
              >
                Educational Certificates
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_exp_cert_submitted"
                :value="true"
                name="flavour-3a"
              >
                Professional/Other Certificates
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </tab-content>
      <!-- Login Credentials -->
      <tab-content
        title="Login Credentials"
        :before-change="validationFormLogin"
      >
        <validation-observer
          ref="loginRules"
          tag="form"
        >
          <b-row>

            <b-col
              cols="12"
              class="mb-2"
            >
              <b-alert
                variant="danger"
                show
              >
                <div class="alert-body">
                  <span><strong>Kindly select your role</strong></span>
                </div>
              </b-alert>
              <!-- <h5 class="mb-0">
                Login Credentials
              </h5> -->
            </b-col>
            <b-col md="12">
              <validation-provider
                #default="{ errors }"
                name="Select Role"
                rules="required"
              >
                <b-form-group
                  label="Roles"
                  label-for="role"
                  :state="errors.length > 0 ? false:null"
                >
                  <!-- <v-select
                    id="role"
                    v-model="selectedRole"
                    :options="staff_roles"
                    label="display_name"
                  /> -->
                  <el-select
                    id="role"
                    v-model="form.roles"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(role, index) in staff_roles"
                      :key="index"
                      :label="role.display_name"
                      :value="role.id"
                      :disabled="role.name !== 'teacher' && role.name !== 'non-teacher'"
                    />
                  </el-select>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Username"
                label-for="sponsor_username"
              >
                <b-form-input
                  id="sponsor_username"
                  v-model="form.username"
                  readonly
                />
                <small>This will serve as password on first login after account activation</small>
              </b-form-group>
            </b-col>
            <!-- <b-col md="12">
              <b-form-group>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="Password"
                  rules="required|password"
                >
                  <b-form-input
                    v-model="form.password"
                    type="password"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Your Password"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group>
                <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
                >
                  <b-form-input
                    v-model="form.c_password"
                    :state="errors.length > 0 ? false:null"
                    type="password"
                    placeholder="Confirm Password"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col> -->
          </b-row>
        </validation-observer>
      </tab-content>
    </form-wizard>

  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormInvalidFeedback,
  BFormDatepicker,
  BFormCheckbox,
  BAlert,
} from 'bootstrap-vue'
import { required, email } from '@validations'
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
    BAlert,
    vSelect,
    BFormInvalidFeedback,
    BFormDatepicker,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  props: {
    school: {
      type: Object,
      required: true,
    },
    pin: {
      type: Number,
      required: true,
    },
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      form: {
        last_name: '',
        first_name: '',
        dob: '',
        gender: '',
        country_id: '',
        state_id: '',
        lga_id: '',
        photo: '',
        phone1: '',
        phone2: '',
        email,
        address: '',
        roles: [],
        username: '',
        password: '',
        c_password: '',
        is_cv_submitted: null,
        is_edu_cert_submitted: null,
        is_exp_cert_submitted: null,
        required,
      },
      empty_form: {
        last_name: '',
        first_name: '',
        dob: '',
        gender: '',
        country_id: '',
        state_id: '',
        lga_id: '',
        photo: '',
        phone1: '',
        phone2: '',
        email,
        address: '',
        roles: [],
        username: '',
        password: '',
        is_cv_submitted: null,
        is_edu_cert_submitted: null,
        is_exp_cert_submitted: null,
        required,
      },
      // codeIcon,
      staff_roles: [],
      countries: [],
      selectedCountry: '',
      states: [],
      selectedState: '',
      lgas: [],
      selectedLGA: '',
      genders: ['Male', 'Female'],
      loader: false,
    }
  },
  created() {
    this.fetchFormDetails()
  },
  methods: {
    // onContext(ctx) {
    //   // The date formatted in the locale, or the `label-no - date - selected` string
    //   this.formatted = ctx.selectedFormatted
    //   // The following will be an empty string until a valid date is entered
    //   this.selected = ctx.selectedYMD
    // },
    fetchFormDetails() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('staff/create')
      fetchCurriculumSetupResource.list({ school_id: app.school.id })
        .then(response => {
          app.countries = response.countries
          app.selectedCountry = response.selected_country
          app.staff_roles = response.staff_roles
          app.form.username = response.username
          app.setState()
        })
    },
    setState() {
      const app = this
      app.lgas = []
      app.states = app.selectedCountry.states
    },
    setLgas() {
      const app = this
      app.lgas = app.selectedState.lgas
    },
    formSubmitted() {
      const app = this
      const saveStudentResource = new Resource('staff/store-with-pin')
      const { form } = app
      form.country_id = app.selectedCountry.id
      form.state_id = app.selectedState.id
      form.lga_id = app.selectedLGA.id
      form.school_id = app.school.id
      form.pin_id = app.pin
      app.loader = true
      saveStudentResource.store(form)
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
        }).catch(error => {
          app.loader = false
          console.log(error)
        })
    },
    validationFormAdmission() {
      return new Promise((resolve, reject) => {
        this.$refs.admissionRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormSponsor() {
      return new Promise((resolve, reject) => {
        this.$refs.sponsorRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormLogin() {
      return new Promise((resolve, reject) => {
        this.$refs.loginRules.validate().then(success => {
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
