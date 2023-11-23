<template>
  <div v-loading="loader">
    <b-card class="mb-0">
      <div align="center">
        <img
          src="/images/logo/logo.png"
          alt="logo"
          width="150"
          class="mx-auto"
        >
        <h3>Register New School</h3>
        <router-link to="/login">
          Go to Portal
        </router-link>
      </div>
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
          title="School Information"
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
                  School Full Information
                </h5>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="School Full Name"
                  label-for="name"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="name"
                    rules="required"
                  >
                    <b-form-input
                      id="name"
                      v-model="form.name"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Example: Lekki British School"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="School Abbreviated Name"
                  label-for="slug"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="slug"
                    rules="required"
                  >
                    <b-form-input
                      id="slug"
                      v-model="form.slug"
                      placeholder="Example: LBS"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="School Email"
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
                  label="Official Phone Number"
                  label-for="phone"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Official Phone Number"
                    rules="required|integer:min:11|integer:max:11"
                  >
                    <b-form-input
                      id="phone"
                      v-model="form.phone"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Enter Official Phone Number"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="School Website"
                  label-for="website"
                >
                  <b-form-input
                    id="website"
                    v-model="form.website"
                    placeholder="Enter School Website"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Estimated number of students"
                  label-for="estimated_no_of_students"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Estimated number of students"
                  >
                    <el-select
                      v-model="form.estimated_no_of_students"
                      placeholder="Select No. of Student"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(no_of_student, index) in estimated_no_of_students"
                        :key="index"
                        :label="no_of_student"
                        :value="no_of_student"
                      />
                    </el-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="School Curriculum"
                  label-for="curriculum"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="School Curriculum"
                  >
                    <el-select
                      v-model="form.curriculum"
                      placeholder="Select School Curriculum"
                      style="width: 100%"
                    >
                      <el-option
                        label="Nigerian"
                        value="Nigerian"
                      />
                      <el-option
                        label="British"
                        value="British"
                      />
                    </el-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="School Address"
                  label-for="address"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="address"
                    rules="required"
                  >
                    <b-form-input
                      id="slug"
                      v-model="form.address"
                      placeholder="Enter School Address"
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
                  name="State of Location"
                  rules="required"
                >
                  <b-form-group
                    label="State of Location"
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
                    label="LGA of Location"
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
                <b-form-group label="Tick As Appropriate">
                  <b-form-checkbox
                    v-model="form.nursery"
                    :value="true"
                    name="flavour-3a"
                  >
                    Has Nursery
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="form.pry"
                    :value="true"
                    name="flavour-3a"
                  >
                    Has Primary
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="form.secondary"
                    :value="true"
                    name="flavour-3a"
                  >
                    Has Secondary
                  </b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-row>
          </validation-observer>
        </tab-content>
        <!-- Admission details tab -->
        <tab-content
          title="School Administrator Information"
          :before-change="validationFormAdministrator"
        >
          <validation-observer
            ref="administratorRules"
            tag="form"
          >
            <b-row>
              <b-col
                cols="12"
                class="mb-2"
              >
                <h5 class="mb-0">
                  Administrator Details
                </h5>
              </b-col>
              <b-col md="6">
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
                      v-model="form.admin_first_name"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
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
                      v-model="form.admin_last_name"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
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
                    rules="required"
                  >
                    <b-form-input
                      id="email"
                      v-model="form.admin_email"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                    <small class="text-primary"><strong>On successful registration a notification will be sent to this e-mail</strong></small>
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
                      v-model="form.admin_gender"
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
              <b-col md="6">
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
                      v-model="form.admin_phone1"
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
                    v-model="form.admin_phone2"
                    placeholder="Enter Alternative Phone Number"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </validation-observer>
        </tab-content>
      </form-wizard>
    </b-card>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormCheckbox,
  // BAlert,
} from 'bootstrap-vue'
import { required, email } from '@validations'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
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
    BFormCheckbox,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      form: {
        name: '',
        slug: '',
        estimated_no_of_students: '0-100',
        email,
        website: '',
        phone: '',
        address: '',
        country_id: '',
        state_id: '',
        lga_id: '',
        curriculum: '',
        nursery: '',
        pry: '',
        secondary: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone2: '',
        admin_phone1: '',
        admin_gender: '',
        required,
      },
      empty_form: {
        name: '',
        slug: '',
        estimated_no_of_students: '0-100',
        email,
        website: '',
        phone: '',
        address: '',
        country_id: '',
        state_id: '',
        lga_id: '',
        curriculum: '',
        nursery: '',
        pry: '',
        secondary: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone2: '',
        admin_phone1: '',
        admin_gender: '',
        required,
      },
      // codeIcon,
      countries: [],
      selectedCountry: '',
      states: [],
      selectedState: '',
      lgas: [],
      selectedLGA: '',
      genders: ['Male', 'Female'],
      loader: false,
      estimated_no_of_students: ['0-100', '100-200', '200-300', '300-400', '400-500', '500-600', '600-700', '700-800', '800-900', '900-1000', '1000+'],
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
      const fetchCurriculumSetupResource = new Resource('school/create')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.countries = response.countries
          app.selectedCountry = response.selected_country
          // app.levels = response.levels
          // app.form.registration_no = response.reg_no
          // app.form.username = response.parent_username
          // app.admission_sessions = response.admission_sessions
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
    setClass() {
      const app = this
      app.classes = app.selectedLevel.class_teachers
    },
    formSubmitted() {
      const app = this
      const registerSchoolResource = new Resource('school/register')
      const { form } = app
      form.country_id = app.selectedCountry.id
      form.state_id = app.selectedState.id
      form.lga_id = app.selectedLGA.id
      app.loader = true
      registerSchoolResource.store(form)
        .then(response => {
          app.form = app.empty_form
          console.log(response)
          app.loader = false

          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Successful Registration',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
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
    validationFormAdministrator() {
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
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
