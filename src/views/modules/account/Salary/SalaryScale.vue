<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Salary Scale</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span
            v-if="checkPermission(['can create salary scale'])"
            class="demo-inline-spacing pull-right"
          >
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              size="sm"
              @click="isCreateSalaryScaleSidebarActive = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <v-client-table
      v-model="salary_scales"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <template
        slot="child_row"
        slot-scope="{row}"
      >
        <b-row>
          <b-col
            v-for="(each_staff, index) in row.staff"
            :key="index"
            cols="4"
          >
            <el-alert
              v-if="each_staff.user"
              :closable="false"
              type="success"
            >{{ parseInt(index + 1) + '. ' + each_staff.user.first_name + ' ' + each_staff.user.last_name }}
            </el-alert>
          </b-col>
        </b-row>
      </template>
      <div
        slot="salary"
        slot-scope="{row}"
      >
        {{ currency + row.salary.toLocaleString() }}
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <span
          class="demo-inline-spacing pull-right"
        >
          <b-button
            v-if="checkPermission(['can update salary scale'])"
            variant="gradient-warning"
            size="sm"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
            <span class="align-middle">Edit</span>
          </b-button>
          <b-button
            v-if="checkPermission(['can change staff salary scale'])"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-success"
            size="sm"
            @click="addStaffToScale(props.row)"
          >
            <feather-icon
              icon="PlusIcon"
              class="mr-50"
            />
            <span class="align-middle">Add Staff</span>
          </b-button>
        </span>
      </div>
    </v-client-table>
    <b-modal
      v-model="showModal"
      title="Add Staff to Salary Scale"
      hide-footer
    >
      <h5>Pick Staff you wish to add to {{ selected_scale.name }} Salary Scale</h5>
      <code>Multiple selection enabled</code><br>
      <b-form-group>
        <el-select
          v-model="form.staff_ids"
          style="width: 100%;"
          placeholder="Select Staff"
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="(each_staff, index) in staff"
            :key="index"
            :label="each_staff.user.first_name + ' ' + each_staff.user.last_name"
            :value="each_staff.id"
          />
        </el-select>
      </b-form-group>
      <b-form-group>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1"
          @click="assignStaffSalaryScale()"
        >
          Submit
        </b-button>
      </b-form-group>
    </b-modal>
    <create-salary-scale
      v-if="isCreateSalaryScaleSidebarActive"
      v-model="isCreateSalaryScaleSidebarActive"
      :currency="currency"
      @save="updateTable"
    />
    <edit-salary-scale
      v-if="isEditSalaryScaleSidebarActive"
      v-model="isEditSalaryScaleSidebarActive"
      :selected-salary-scale="editable_row"
      :currency="currency"
      @update="updateTable"
    />
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, BModal, BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'
import CreateSalaryScale from './partials/CreateSalaryScale.vue'
import EditSalaryScale from './partials/EditSalaryScale.vue'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    CreateSalaryScale,
    EditSalaryScale,
    BButton,
    BModal,
    BRow,
    BCol,
    BFormGroup,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isCreateSalaryScaleSidebarActive: false,
      isEditSalaryScaleSidebarActive: false,
      showModal: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'salary',
        'action',
      ],

      options: {
        headings: {
          action: '',

          // id: 'S/N',
        },
        filterByColumn: true,
        sortable: [
          'name',
          'salary',
        ],
        // filterable: false,
        filterable: [
          'name',
          'salary',
        ],
      },
      staff_columns: [
        'user.username',
        'user.first_name',
        'user.last_name',
      ],

      staff_options: {
        headings: {
          'user.username': 'Staff ID',
          'user.first_name': 'First Name',
          'user.last_name': 'Last Name',

          // id: 'S/N',
        },
        filterByColumn: true,
        sortable: [
          'user.username',
          'user.first_name',
          'user.last_name',
        ],
        // filterable: false,
        filterable: [
          'user.username',
          'user.first_name',
          'user.last_name',
        ],
      },
      salary_scales: [],
      staff: [],
      loading: false,
      editable_row: '',
      selected_scale: '',
      currency: '',

      form: {
        staff_ids: [],
        salary_scale_id: '',
      },
    }
  },
  created() {
    this.fetchStaff()
    this.fetchSalaryScale()
  },
  methods: {
    checkPermission,
    addStaffToScale(scale) {
      this.selected_scale = scale
      this.form.salary_scale_id = scale.id
      this.showModal = true
    },
    fetchSalaryScale() {
      const app = this
      app.loading = true
      const fetchSchoolFeesSettingsResource = new Resource('account/salary/scale')
      fetchSchoolFeesSettingsResource.list()
        .then(response => {
          app.salary_scales = response.salary_scales
          app.currency = response.currency
          app.loading = false
        })
    },
    fetchStaff() {
      const app = this
      const fetchLevelsResource = new Resource('user-setup/staff/fetch')
      fetchLevelsResource.list()
        .then(response => {
          app.staff = response.staff
        })
    },
    updateTable() {
      const app = this
      app.fetchSalaryScale()
    },
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value
      app.isEditSalaryScaleSidebarActive = true
    },
    assignStaffSalaryScale() {
      const app = this
      const param = app.form
      app.loading = true
      const applyFeeToStudentsResource = new Resource('account/salary/assign-staff-salary-scale')
      applyFeeToStudentsResource.update(param.salary_scale_id, param)
        .then(() => {
          app.fetchSalaryScale()
          app.$alert('Action Successfull')
          app.loading = false
          app.showModal = false
          app.form.staff_ids = []
        }).catch(() => {
          this.$message('An error occured')
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
