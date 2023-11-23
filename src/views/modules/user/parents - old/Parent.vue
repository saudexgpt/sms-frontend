<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            List of Parents/Guardians
          </h3>
        </b-col>
      </b-row>
    </div>
    <div>
      <!-- <div
        v-if="level !== ''"
        class="demo-spacing-0"
      >
        <b-alert
          variant="primary"
          show
        >
          <div class="alert-body">
            <span><strong align="center">Students in {{ level.level }}</strong></span>
          </div>
        </b-alert>
      </div> -->
      <v-client-table
        v-model="guardians"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="wards"
          slot-scope="props"
        >
          {{ props.row.guardian_students.length }}
        </div>
        <div
          slot="phone1"
          slot-scope="props"
        >
          {{ props.row.user.phone1 + '|' + props.row.user.phone2 }}
        </div>
        <div
          slot="action"
          slot-scope="props"
        >
          <span>
            <b-button
              v-b-tooltip.hover.right="'View Details'"
              variant="gradient-primary"
              class="btn-icon rounded-circle"
            >

              <router-link
                :to="{name: 'guardiansDetails', params: {id: props.row.id}}"
                style="color: #fff;"
              ><feather-icon icon="EyeIcon" /></router-link>
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
          </span>
        </div>
      </v-client-table>

    </div>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
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
        'phone1',
        // 'user.gender',
        'wards',
      ],

      options: {
        headings: {
          'user.username': 'ID',
          'user.last_name': 'Surname',
          'user.first_name': 'Other Names',
          'user.email': 'Email',
          phone1: 'Phone',
          // 'user.gender': 'Gender',
          wards: 'No. of Wards',
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
          'user.email',
          'user.phone1',
        ],
        // filterable: false,
        filterable: [
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone',
          'user.phone1',
          'user.phone2',
        ],
      },
      guardians: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      selected_teacher: '',
    }
  },
  created() {
    this.fetchGuardians()
  },
  methods: {
    fetchGuardians() {
      const app = this
      app.loading = true
      const fetchGuardianResource = new Resource('user-setup/guardians')
      fetchGuardianResource.list()
        .then(response => {
          app.guardians = response.guardians
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
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value
      app.isEditClassSidebarActive = true
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
