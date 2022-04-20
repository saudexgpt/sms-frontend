<template>
  <div v-loading="loader">
    <b-form @submit.prevent>
      <b-row>
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
                v-model="form.first_name"
                :state="errors.length > 0 ? false : null"
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
                v-model="form.last_name"
                :state="errors.length > 0 ? false : null"
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
              rules="required|email"
            >
              <b-form-input
                id="email"
                v-model="form.email"
                :state="errors.length > 0 ? false : null"
                type="email"
              />
              <small class="text-danger">{{ errors[0] }}</small>
              <!-- <small class="text-primary"><strong>On successful registration a notification will be sent to this e-mail</strong></small> -->
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
                :state="errors.length > 0 ? false : null"
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
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>

      </b-row>
      <b-button
        type="submit"
        variant="primary"
        class="mr-1"
        @click="formSubmitted()"
      >
        Submit
      </b-button>

    </b-form>

  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BForm,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BButton,
  // BAlert,
} from 'bootstrap-vue'
import { required, email } from '@validations'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    ValidationProvider,
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BButton,
    // BAlert,
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
      required,
      email,
      form: {
        staff_id: '',
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
        role: '',
      },
      // codeIcon,
      staff_roles: [],
      selectedLGA: '',
      genders: ['Male', 'Female'],
      loader: false,
    }
  },
  created() {
    this.setFormProperties(this.selectedStaff)
  },
  methods: {
    setFormProperties(selectedStaff) {
      const app = this
      app.form = selectedStaff.user
      app.form.staff_id = selectedStaff.id
    },
    formSubmitted() {
      const app = this
      const saveStaffResource = new Resource('partners/update')
      const { form } = app
      app.loader = true
      saveStaffResource
        .update(form.staff_id, form)
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
        })
        .catch(error => {
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
