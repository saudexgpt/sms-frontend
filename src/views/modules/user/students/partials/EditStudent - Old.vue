<template>
  <div
    v-if="studentInClass"
    v-loading="loader"
  >
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
                Student's Personal Information
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
                  rules="required|regex:^\d{4}-\d{2}-\d{2}$"
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
                      autocomplete="off"
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
            <b-col md="6">
              <b-form-group
                label="Disability"
                label-for="disability"
              >

                <el-select
                  v-model="form.disability"
                  style="width: 100%;"
                  placeholder="If applicable"
                >
                  <el-option
                    v-for="(disability, index) in disabilities"
                    :key="index"
                    :label="disability"
                    :value="disability"
                  />
                </el-select>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
      <!-- Admission details tab -->
      <tab-content
        title="Admission Details"
        :before-change="validationFormAdmission"
      >
        <validation-observer
          ref="admissionRules"
          tag="form"
        >
          <b-row>
            <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0">
                Admission Details
              </h5>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Admission No."
                label-for="registration_no"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Admission No."
                  rules="required"
                >
                  <b-form-input
                    id="registration_no"
                    v-model="form.registration_no"
                    :state="errors.length > 0 ? false:null"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Admission Session"
                label-for="admission_session"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Admission Session"
                  rules="required"
                >
                  <el-select
                    v-model="form.admission_sess_id"
                    style="width: 100%;"
                    placeholder="Select Session"
                  >
                    <el-option
                      v-for="(session, index) in admission_sessions"
                      :key="index"
                      :label="session.name"
                      :value="session.id"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col
              md="6"
            >
              <validation-provider
                #default="{ errors }"
                name="Student Level"
                rules="required"
              >
                <b-form-group
                  label="Student Level"
                  label-for="level"
                  :state="errors.length > 0 ? false:null"
                >
                  <v-select
                    id="level"
                    v-model="selected_level"
                    :options="levels"
                    label="level"
                    @input="setClass()"
                  />
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col
              md="6"
            >
              <validation-provider
                #default="{ errors }"
                name="Student Class"
                rules="required"
              >
                <b-form-group
                  label="Student Class"
                  label-for="class"
                  :state="errors.length > 0 ? false:null"
                >
                  <el-select
                    id="class"
                    v-model="form.class_teacher_id"
                    style="width: 100%;"
                    placeholder="Select Class"
                  >
                    <el-option
                      v-for="(class_teacher, index) in classes"
                      :key="index"
                      :label="class_teacher.c_class.name"
                      :value="class_teacher.id"
                    />
                  </el-select>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- Sponsor  -->
      <tab-content
        title="Sponsor's Details"
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
                Sponsor's Details
              </h5>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Main Mobile Number"
                label-for="parent_phone"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Main Phone Number"
                  rules="required|integer:min:11|integer:max:11"
                >
                  <b-form-input
                    id="parent_phone"
                    v-model="form.parent_phone"
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
                label-for="parent_phone2"
                rules="integer:min:11|integer:max:11"
              >
                <b-form-input
                  id="parent_phone2"
                  v-model="form.parent_phone2"
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
                    v-model="form.lname"
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
                    v-model="form.fname"
                    placeholder="Enter other names"
                    :state="errors.length > 0 ? false:null"
                  />
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
                    v-model="form.sponsor_gender"
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
                label="Relationship with Child"
                label-for="relationship"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Relationship with Child"
                  rules="required"
                >

                  <el-select
                    v-model="form.relation"
                    style="width: 100%;"
                    placeholder="Select Relationship"
                  >
                    <el-option
                      v-for="(relationship, index) in relationships"
                      :key="index"
                      :label="relationship"
                      :value="relationship"
                    />
                  </el-select>
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
            <b-col md="6">
              <b-form-group
                label="Occupation"
                label-for="occupation"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Occupation"
                  rules="required"
                >
                  <b-form-input
                    id="occupation"
                    v-model="form.occupation"
                    placeholder="Enter sponsor's occupation"
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
                v-model="form.is_prev_cert_submitted"
                :value="1"
                name="flavour-3a"
              >
                Previous Class Certificate
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_transfer_cert_submitted"
                :value="1"
                name="flavour-3a"
              >
                Transfer certificate
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_academic_transcript_submitted"
                :value="1"
                name="flavour-3a"
              >
                Academic Transcript
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_national_birth_cert_submitted"
                :value="1"
                name="flavour-3a"
              >
                National Birth Certificate
              </b-form-checkbox>
              <b-form-checkbox
                v-model="form.is_testimonial_submitted"
                :value="1"
                name="flavour-3a"
              >
                Testimonial
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
    studentInClass: {
      type: Object,
      default: () => null,
    },
    selectedLevel: {
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
        id: '',
        student_id: '',
        last_name: '',
        first_name: '',
        registration_no: '',
        student_password: '',
        dob: '',
        gender: '',
        country_id: '',
        state_id: '',
        lga_id: '',
        disablility: '',
        admission_sess_id: '',
        level_id: '',
        class_teacher_id: '',
        photo: '',
        parent_phone: '',
        parent_phone2: '',
        email,
        lname: '',
        fname: '',
        sponsor_gender: '',
        relation: '',
        address: '',
        occupation: '',
        other_occupation: '',
        username: '',
        password: '',
        is_prev_cert_submitted: null,
        is_transfer_cert_submitted: null,
        is_academic_transcript_submitted: null,
        is_national_birth_cert_submitted: null,
        is_testimonial_submitted: null,
        required,
      },
      // codeIcon,
      levels: [],
      selected_level: null,
      classes: [],
      countries: [],
      selectedCountry: '',
      defaultCountry: '',
      states: [],
      selectedState: '',
      lgas: [],
      selectedLGA: '',
      admission_sessions: [],
      genders: ['Male', 'Female'],
      disabilities: ['', 'Eye Defect', 'Ear Defect', 'Dumb', 'Paralyzed'],
      relationships: ['Parent', 'Guardian'],
      loader: false,
    }
  },
  created() {
    this.selected_level = this.selectedLevel
    this.setFormProperties(this.studentInClass)
    this.fetchFormDetails()
  },
  methods: {
    setFormProperties(studentInClass) {
      const app = this
      const { student } = studentInClass
      app.form.id = studentInClass.id
      app.form.student_id = student.id
      app.selectedCountry = student.user.country
      app.selectedState = student.user.state
      app.selectedLGA = student.user.lga
      app.form.last_name = student.user.last_name
      app.form.first_name = student.user.first_name
      app.form.registration_no = student.registration_no
      app.form.dob = student.user.dob
      app.form.gender = student.user.gender
      app.form.country_id = student.user.country_id
      app.form.state_id = student.user.state_id
      app.form.lga_id = student.user.lga_id
      app.form.disablility = student.user.disablility
      app.form.admission_sess_id = student.admission_sess_id
      app.form.level_admitted = student.level_admitted
      app.form.current_level = student.current_level
      app.form.level_id = student.current_level
      app.form.class_teacher_id = studentInClass.class_teacher_id
      if (student.student_guardian) {
        app.form.parent_phone = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.phone1 : ''
        app.form.parent_phone2 = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.phone2 : ''
        app.form.email = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.email : ''
        app.form.lname = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.last_name : ''
        app.form.fname = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.first_name : ''
        app.form.sponsor_gender = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.gender : ''
        app.form.relation = (student.student_guardian.guardian.user) ? student.student_guardian.relationship : ''
        app.form.address = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.user.address : ''
        app.form.occupation = (student.student_guardian.guardian.user) ? student.student_guardian.guardian.occupation : ''
      }
      app.form.other_occupation = ''
      app.form.is_prev_cert_submitted = student.is_prev_cert_submitted
      app.form.is_transfer_cert_submitted = student.is_transfer_cert_submitted
      app.form.is_academic_transcript_submitted = student.is_academic_transcript_submitted
      app.form.is_national_birth_cert_submitted = student.is_national_birth_cert_submitted
      app.form.is_testimonial_submitted = student.is_testimonial_submitted
      app.form.required = ''
    },
    fetchFormDetails() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('user-setup/students/create')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.countries = response.countries
          app.defaultCountry = response.selected_country
          app.levels = response.levels
          app.form.username = response.parent_username
          app.admission_sessions = response.admission_sessions
          app.setState()
          app.setClass()
        })
    },
    setState() {
      const app = this
      const index = app.countries.indexOf(app.selectedCountry)
      app.lgas = []
      app.states = (index > -1) ? app.countries[index].states : app.defaultCountry.states
      app.setLgas()
    },
    setLgas() {
      const app = this
      const index = app.states.indexOf(app.selectedState)
      app.lgas = (index > -1) ? app.states[index].lgas : []
      // app.lgas = app.selectedState.lgas
    },
    setClass() {
      const app = this
      app.classes = app.selected_level.class_teachers
    },
    formSubmitted() {
      const app = this
      const saveStudentResource = new Resource('user-setup/students/update')
      const { form } = app
      form.level_id = app.selected_level.id
      form.country_id = app.selectedCountry.id
      form.state_id = app.selectedState.id
      form.lga_id = app.selectedLGA.id
      app.loader = true
      saveStudentResource.update(form.id, form)
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
