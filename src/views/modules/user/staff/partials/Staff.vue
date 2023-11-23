<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            List of Staff
          </h3>
        </b-col>
      </b-row>
      <hr>
    </div>
    <div v-if="selectedStaff === null">
      <b-tabs
        pills
        nav-class="nav-pill-danger"
      >
        <b-tab
          :title="`Active (${activeStaff.length})`"
        >
          <span class="pull-right">
            <el-button
              v-if="activeStaff.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of Staff', activeStaff)"
            >Export Excel</el-button>
          </span>
          <v-client-table
            v-model="activeStaff"
            v-loading="loading"
            :columns="columns"
            :options="options"
          >
            <div
              slot="action"
              slot-scope="props"
            >
              <b-dropdown
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                class="mx-1"
                right
                text="Action"
                variant="primary"
              >
                <b-dropdown-item>
                  <router-link
                    :to="{name: 'staffDetails', params: {id: props.row.id}}"
                  >
                    <span><feather-icon icon="EyeIcon" /> View Details</span>
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item @click="editStaff(props.row)">
                  <span><feather-icon icon="Edit2Icon" /> Edit</span>
                </b-dropdown-item>
                <b-dropdown-item @click="resetPassword(props.row.user)">
                  <span><feather-icon icon="UnlockIcon" /> Reset Password</span>
                </b-dropdown-item>
                <b-dropdown-item @click="loginAsUser(props.row.user)">
                  <span v-b-tooltip.hover.right="'Login as ' + props.row.user.first_name"><feather-icon icon="KeyIcon" /> Login</span>
                </b-dropdown-item>
                <b-dropdown-item @click="removeStaff(props.row)">
                  <span v-b-tooltip.hover.right="'Delete ' + props.row.user.first_name"><feather-icon icon="TrashIcon" /> Delete</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </v-client-table>

        </b-tab>
        <b-tab
          :title="`Pending Activation (${deactivatedStaff.length})`"
        >
          <span class="pull-right">
            <el-button
              v-if="deactivatedStaff.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of Staff awaiting activation', deactivatedStaff)"
            >Export Excel</el-button>
          </span>
          <v-client-table
            v-model="deactivatedStaff"
            v-loading="loading"
            :columns="columns"
            :options="options"
          >
            <div
              slot="action"
              slot-scope="props"
            >
              <b-dropdown
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                class="mx-1"
                right
                text="Action"
                variant="dark"
              >
                <b-dropdown-item>
                  <router-link
                    :to="{name: 'staffDetails', params: {id: props.row.id}}"
                  >
                    <span><feather-icon icon="EyeIcon" /> View Details</span>
                  </router-link>
                </b-dropdown-item>
                <!-- <b-dropdown-item @click="editStaff(props.row)">
                  <feather-icon icon="Edit2Icon" /> Edit
                </b-dropdown-item> -->
                <b-dropdown-item @click="approve(props.row.user)">
                  <span><feather-icon icon="ThumbsUpIcon" /> Activate</span>
                </b-dropdown-item>
                <b-dropdown-item @click="removeStaff(props.row)">
                  <span><feather-icon icon="TrashIcon" /> Delete</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </v-client-table>

        </b-tab>
      </b-tabs>
    </div>
    <div v-else>
      <edit-staff
        :selected-staff="selectedStaff"
        @update="reloadTable()"
      />
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BDropdown, BDropdownItem, BTabs, BTab,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import EditStaff from './EditStaff.vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'

export default {
  components: {
    EditStaff,
    BTabs,
    BTab,
    // VueGoodTable,
    // vSelect,
    // BButton,
    BDropdown,
    BDropdownItem,
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
      downloadLoading: false,
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'user.username',
        'user.last_name',
        'user.first_name',
        // 'user.email',
        // 'user.phone1',
        'user.gender',
        'action',
        // 'user.password_status',
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
      activeStaff: [],
      deactivatedStaff: [],
      loading: false,
      selectedStaff: null,
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
      const fetchStaffResource = new Resource('user-setup/staff')
      fetchStaffResource.list()
        .then(response => {
          app.staff = response.staff
          app.filterStaff(response.staff)
          app.loading = false
        })
    },
    filterStaff(staff) {
      const app = this
      app.activeStaff = []
      app.deactivatedStaff = []
      staff.forEach(element => {
        if (element.user !== null) {
          if (element.user.is_confirmed === '0') {
            app.deactivatedStaff.push(element)
          }
          if (element.user.is_confirmed === '1') {
            app.activeStaff.push(element)
          }
        }
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
      app.$confirm(`This will change the password for ${user.username}. Do you want to continue?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const resetPasswordResource = new Resource('user-setup/admin-reset/password')
        resetPasswordResource.list(param)
          .then(() => {
            app.$alert(`Password for ${user.username} has been reset to: password `, 'Password Reset', {
              confirmButtonText: 'OK',
            })
            app.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    approve(user) {
      const app = this
      app.$confirm(`This will activate ${user.username}'s account. Do you want to continue?`, 'Confirm Activation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const resetPasswordResource = new Resource('user-setup/approve-user')
        resetPasswordResource.update(user.id)
          .then(() => {
            app.$alert('Account activation successful', 'Successful', {
              confirmButtonText: 'OK',
            })
            this.reloadTable()
            app.loading = false
          })
      }).catch(() => {
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
    },
    reloadTable() {
      this.selectedStaff = null
      this.fetchStaff()
    },
    removeStaff(staff) {
      this.$confirm(`This will delete ${staff.user.username} from the portal. It cannot be undone. Do you want to continue?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const deleteStaffResource = new Resource('user-setup/staff/destroy')
        deleteStaffResource.destroy(staff.id)
          .then(() => {
            this.reloadTable()
            this.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    handleDownload(tableTitle, staffList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'STAFF ID',
          'SURNAME',
          'OTHER NAMES',
          'EMAIL',
          'PHONE',
          'GENDER',
        ]
        const filterVal = [
          // 'studentship_status',
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone1',
          'user.gender',
        ]
        const list = staffList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv',
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'user.username') {
          return v.user.username
        }
        if (j === 'user.last_name') {
          return v.user.last_name
        }
        if (j === 'user.first_name') {
          return v.user.first_name
        }
        if (j === 'user.email') {
          return v.user.email
        }
        if (j === 'user.phone1') {
          return v.user.phone1
        }
        if (j === 'user.gender') {
          return v.user.gender
        }

        return v[j]
      }))
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
