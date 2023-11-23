<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateIncomeSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-income-expenses-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Add Income/Expenses
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
          <b-row v-loading="load">
            <b-col cols="12">
              <strong>All fields are required</strong>
            </b-col>

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Select Type"
              >
                <el-select
                  v-model="form.status"
                  style="width: 100%;"
                  placeholder="Select Level"
                >
                  <el-option
                    v-for="(status, index) in statuses"
                    :key="index"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="User Role"
              >
                <el-select
                  v-model="form.payer_recipient_role"
                  style="width: 100%;"
                  placeholder="User Role"
                >
                  <el-option
                    v-for="(role, index) in roles"
                    :key="index"
                    :label="role.label"
                    :value="role.value"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Concerned User"
              >
                <el-select
                  v-if="form.payer_recipient_role === 'student'"
                  v-model="form.payer_recipient_id"
                  style="width: 100%;"
                  filterable
                  placeholder="Select Student"
                >
                  <el-option
                    v-for="(student, index) in students"
                    :key="index"
                    :label="student.user.first_name + ' ' + student.user.last_name"
                    :value="student.user_id"
                  />
                </el-select>
                <el-select
                  v-if="form.payer_recipient_role === 'staff'"
                  v-model="form.payer_recipient_id"
                  style="width: 100%;"
                  filterable
                  placeholder="Select Staff"
                >
                  <el-option
                    v-for="(each_staff, index) in staff"
                    :key="index"
                    :label="each_staff.user.first_name + ' ' + each_staff.user.last_name"
                    :value="each_staff.user_id"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Enter Amount"
              >
                <el-input
                  v-model="form.amount_paid"
                  placeholder="Enter Amount"
                >
                  <template #prepend>
                    {{ currency }}
                  </template>
                </el-input>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Purpose"
              >
                <el-input
                  v-model="form.purpose"
                  placeholder="Purpose"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Date"
              >

                <el-date-picker
                  v-model="form.date"
                  type="date"
                  placeholder="Pick a month"
                  :picker-options="pickerOptions"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
// import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // vSelect,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateIncomeSidebarActive',
    event: 'update:is-create-income-expenses-sidebar-active',
  },
  props: {
    isCreateIncomeSidebarActive: {
      type: Boolean,
      required: true,
    },
    staff: {
      type: Array,
      required: true,
    },
    students: {
      type: Array,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      form: {
        purpose: '',
        amount_paid: '',
        payer_recipient_id: '',
        payer_recipient_role: 'staff',
        status: 'income',
        date: new Date(),
      },
      roles: [
        { value: 'staff', label: 'Staff' },
        { value: 'student', label: 'Student' },
      ],
      statuses: [
        { value: 'income', label: 'Income' },
        { value: 'expenses', label: 'Expenditure' },
      ],
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumClasss()
  },
  methods: {
    aFieldIsEmpty() {
      const app = this
      return app.form.purpose === '' || app.form.payer_recipient_id === '' || app.form.amount_paid === '' || app.form.payer_recipient_role === ''
    },
    submit() {
      const app = this
      if (app.aFieldIsEmpty()) {
        app.$alert('Kindly fill all empty fields')
        return
      }
      const saveIncomeExpensesResource = new Resource('account/revenue/add-income-expenses')
      const param = app.form
      app.load = true
      saveIncomeExpensesResource.store(param)
        .then(() => {
          app.$emit('save')
          app.$emit('update:is-create-income-expenses-sidebar-active', false)
          app.load = false
        }).catch(() => {
          app.load = false
          app.$message('An error occured')
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
