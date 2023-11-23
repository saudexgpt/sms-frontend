<template>
  <div>
    <div slot="header">
      <b-row v-if="selectedStaff === null">
        <b-col cols="7">
          <h3>
            List of Staff
          </h3>
        </b-col>
      </b-row>
      <hr>
    </div>
    <div v-if="selectedStaff === null">
      <v-client-table
        v-model="staff"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="action"
          slot-scope="props"
        >
          <span>
            <b-button
              v-b-tooltip.hover.right="'View Details'"
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              @click="viewStaffDetails(props.row)"
            ><feather-icon icon="EyeIcon" />
            </b-button>
            <b-button
              v-b-tooltip.hover.right="
                'Edit ' + props.row.user.first_name + ' data'
              "
              variant="success"
              class="btn-icon rounded-circle"
              @click="editStaff(props.row)"
            ><feather-icon icon="Edit2Icon" />
            </b-button>
            <b-button
              v-b-tooltip.hover.right="'Reset Password'"
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="resetPassword(props.row.user)"
            >
              <feather-icon icon="UnlockIcon" />
            </b-button>
            <b-button
              v-b-tooltip.hover.right="'Login as ' + props.row.user.first_name"
              variant="dark"
              class="btn-icon rounded-circle"
              @click="loginAsUser(props.row.user)"
            >
              <feather-icon icon="KeyIcon" />
            </b-button>
            <b-button
              v-b-tooltip.hover.right="'Delete ' + props.row.user.first_name"
              variant="danger"
              class="btn-icon rounded-circle"
              @click="removeStaff(props.row)"
            >
              <feather-icon icon="TrashIcon" />
            </b-button>
          </span>
        </div>
      </v-client-table>
    </div>
    <div v-else>
      <b-button
        variant="gradient-danger"
        class="btn-icon"
        @click="selectedStaff = null"
      >
        Back
      </b-button>
      <edit-staff
        v-if="edit_staff"
        :selected-staff="selectedStaff"
        @update="reloadTable()"
      />
      <staff-details
        v-if="view_details"
        :staff="selectedStaff"
        @update="reloadTable()"
      />
    </div>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import EditStaff from './EditCompanyStaff.vue'
import StaffDetails from './CompanyStaffDetails.vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'

export default {
  components: {
    EditStaff,
    StaffDetails,
    // VueGoodTable,
    // vSelect,
    BButton,
    // BAlert,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'user.username',
        'user.last_name',
        'user.first_name',
        'user.email',
        'user.phone1',
        'user.gender',
        'user.password_status',
      ],

      options: {
        headings: {
          'user.username': 'ID',
          'user.last_name': 'Surname',
          'user.first_name': 'Other Names',
          'user.email': 'Email',
          'user.phone1': 'Phone',
          'user.gender': 'Gender',
          'user.password_status': 'Password Status',
          action: '',

          // id: 'S/N',
        },

        // rowAttributesCallback(row) {
        //   if (row.student.studentship_status === 'left') {
        //     return { style: 'background: #d83b3beb; color: #000000' }
        //   }
        //   if (row.student.studentship_status === 'suspended') {
        //     return { style: 'background: #dfbe5d; color: #000000' }
        //   }
        //   // if (row.student.studentship_status === 'graduated') {
        //   //   return { style: 'background: #6610f2; color: #ffffff' }
        //   // }
        //   return { style: 'background: #36c15ecf; color: #000000' }
        // },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.gender',
          'user.email',
          'user.phone',
          'user.password_status',
        ],
        // filterable: false,
        filterable: [
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.gender',
          'user.email',
          'user.phone',
          'user.password_status',
        ],
      },
      staff: [],
      loading: false,
      selectedStaff: null,
      edit_staff: false,
      view_details: false,
      selected_row_index: '',
      selected_teacher: '',
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    fetchStaff() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('partners')
      fetchStaffResource.list().then(response => {
        app.staff = response.staff
        app.loading = false
      })
    },
    async loginAsUser(user) {
      await this.$store.dispatch('user/loginAsUser', { user_id: user.id })
      // this.$router.push('/login').catch(() => {})
      window.location = '/'
    },
    resetPassword(user) {
      const app = this
      const param = {
        user_id: user.id,
      }
      app
        .$confirm(
          `This will change the password for ${user.username}. Do you want to continue?`,
          'Confirm Action',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning',
          },
        )
        .then(() => {
          app.loading = true
          const resetPasswordResource = new Resource(
            'user-setup/admin-reset/password',
          )
          resetPasswordResource.list(param).then(() => {
            app.$alert(
              `Password for ${user.username} has been reset to: password `,
              'Password Reset',
              {
                confirmButtonText: 'OK',
              },
            )
            app.loading = false
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    editStaff(value) {
      // console.log(props)
      const app = this
      app.selectedStaff = value
      app.edit_staff = true
    },
    viewStaffDetails(value) {
      // console.log(props)
      const app = this
      app.selectedStaff = value
      app.view_details = true
    },
    reloadTable() {
      this.selectedStaff = null
      this.edit_staff = false
      this.view_details = false
      this.fetchStaff()
    },
    removeStaff(staff) {
      this.$confirm(
        `This will delete ${staff.user.username} from the portal. It cannot be undone. Do you want to continue?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        },
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('partners/destroy')
          deleteStaffResource.destroy(staff.id).then(() => {
            this.reloadTable()
            this.loading = false
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
