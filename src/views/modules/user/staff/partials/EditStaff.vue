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
            <b-col md="6">
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
            <b-col md="6">
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
            <b-col md="6">
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
              md="6"
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
              md="6"
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
            <b-col md="6">
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
            <b-col md="6">
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
            <b-col md="6">
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
            <b-col md="6">
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
            <b-col md="6">
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
            <b-col md="6">
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
                :value="1"
                name="flavour-3a"
              >
                Resume/Curriculum Vitae
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_edu_cert_submitted"
                :value="1"
                name="flavour-3a"
              >
                Educational Certificates
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_exp_cert_submitted"
                :value="1"
                name="flavour-3a"
              >
                Professional/Other Certificates
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
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
  // BAlert,
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
    // BAlert,
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
    selectedStaff: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      form: {
        staff_id: '',
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
    this.setFormProperties(this.selectedStaff)
    this.fetchFormDetails()
  },
  methods: {
    setFormProperties(selectedStaff) {
      const app = this
      app.form = selectedStaff.user
      app.form.staff_id = selectedStaff.id
      app.form.is_cv_submitted = selectedStaff.is_cv_submitted
      app.form.is_edu_cert_submitted = selectedStaff.is_edu_cert_submitted
      app.form.is_exp_cert_submitted = selectedStaff.is_exp_cert_submitted
      app.selectedCountry = selectedStaff.user.country
      app.selectedState = selectedStaff.user.state
      app.selectedLGA = selectedStaff.user.lga
    },
    fetchFormDetails() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('user-setup/staff/create')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.countries = response.countries
          app.staff_roles = response.staff_roles
          app.form.username = response.username
          app.setState()
        })
    },
    setState() {
      const app = this
      app.lgas = []
      app.states = app.selectedCountry.states
      app.setLgas()
    },
    setLgas() {
      const app = this
      app.lgas = app.selectedState.lgas
    },
    formSubmitted() {
      const app = this
      const saveStaffResource = new Resource('user-setup/staff/update')
      const { form } = app
      form.country_id = app.selectedCountry.id
      form.state_id = app.selectedState.id
      form.lga_id = app.selectedLGA.id
      app.loader = true
      saveStaffResource.update(form.staff_id, form)
        .then(() => {
          app.loader = false
          app.$emit('update')
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Update Successful',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
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
