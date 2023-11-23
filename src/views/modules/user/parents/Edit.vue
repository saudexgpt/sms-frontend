<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditClassSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-class-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Parent
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <validation-observer
            ref="sponsorRules"
            tag="form"
          >
            <b-row v-loading="load">

              <!-- first name -->
              <b-col cols="12">
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
              <b-col cols="12">
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
              <b-col cols="12">
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
              <b-col cols="12">
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
              <b-col cols="12">
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
              <b-col cols="12">
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
              <b-col cols="12">
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
              <b-col cols="12">
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
              <!-- submit and reset -->
              <b-col cols="12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="warning"
                  class="mr-1"
                  @click="submit()"
                >
                  Update
                </b-button>
              </b-col>
            </b-row>
          </validation-observer>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
// import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BButton, BFormInput,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email } from '@validations'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // vSelect,
    ValidationProvider,
    ValidationObserver,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEditClassSidebarActive',
    event: 'update:is-edit-class-sidebar-active',
  },
  props: {
    isEditClassSidebarActive: {
      type: Boolean,
      required: true,
    },
    editData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: '',
        user_id: '',
        parent_phone: '',
        parent_phone2: '',
        email,
        guardian_id: '',
        lname: '',
        fname: '',
        sponsor_gender: '',
        address: '',
        occupation: '',
        other_occupation: '',
        username: '',
        password: '',
        required,
      },
      genders: ['Male', 'Female'],
      load: false,
    }
  },
  created() {
    this.setFormDetails(this.editData)
  },
  methods: {
    setFormDetails(data) {
      const app = this
      app.form.user_id = data.user_id
      app.form.lname = data.user.last_name
      app.form.fname = data.user.first_name
      app.form.sponsor_gender = data.user.gender
      app.form.parent_phone = data.user.phone1
      app.form.parent_phone2 = data.user.phone2
      app.form.address = data.user.address
      app.form.occupation = data.occupation
      app.form.email = data.user.email
      app.form.id = data.id
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
    submit() {
      const app = this
      const saveParentResource = new Resource('user-setup/update-parent')
      const param = app.form
      app.load = true
      saveParentResource.update(param.user_id, param)
        .then(() => {
          app.$emit('update')
          app.$emit('update:is-edit-class-sidebar-active', false)
          app.load = false
        }).catch(error => {
          app.$alert(error.response.data.message)
          app.load = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
