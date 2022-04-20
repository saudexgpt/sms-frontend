<template>
  <div v-if="studentData.length > 0">
    <v-client-table
      v-model="studentData"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="studentship_status"
        slot-scope="{row}"
      >{{ (row.studentship_status === 'left') ? 'WITHDRAWN' : row.studentship_status.toUpperCase() }}
      </div>
      <div
        slot="parent_name"
        slot-scope="{row}"
      >{{ row.student_guardian.guardian.user.first_name + ' ' + row.student_guardian.guardian.user.last_name }}
      </div>
      <div
        slot="parent_phone"
        slot-scope="{row}"
      >{{ row.student_guardian.guardian.user.phone1 + ' | ' + row.student_guardian.guardian.user.phone2 }}
      </div>
      <div
        slot="parent_email"
        slot-scope="{row}"
      >{{ row.student_guardian.guardian.user.email }}
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <span>
          <b-button
            v-b-tooltip.hover.right="'View Details'"
            variant="primary"
            class="btn-icon rounded-circle"
          >

            <router-link
              :to="{name: 'studentDetails', params: {id: props.row.id}}"
              style="color: #fff;"
            ><feather-icon icon="EyeIcon" /></router-link>
          </b-button>
        </span>
        <span
          v-if="checkRole(['super'])"
        >
          <b-button
            v-b-tooltip.hover.right="'Reset Password'"
            variant="warning"
            class="btn-icon rounded-circle"
            @click="resetPassword(props.row.user)"
          >
            <feather-icon icon="UnlockIcon" />
          </b-button>
        </span>
        <span
          v-if="checkRole(['super'])"
        >
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
</template>
<script>
import {
  BButton, VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkRole from '@/utils/role'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    studentData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      columns: [
        'action',
        'studentship_status',
        'registration_no',
        'user.last_name',
        'user.first_name',
        'user.gender',
        'user.dob',
        'class_teacher.c_class.name',
        'admission_year',
        'parent_name',
        'parent_phone',
        'parent_email',
      ],

      options: {
        headings: {
          studentship_status: 'Studentship Status',
          registration_no: 'Admission No',
          'user.last_name': 'Surname',
          'user.first_name': 'Other Names',
          'user.gender': 'Gender',
          'user.dob': 'DOB',
          'class_teacher.c_class.name': 'Class',
          admission_year: 'Admission Year',
          parent_name: 'Parent Name',
          parent_phone: 'Parent Phone',
          parent_email: 'Parent Email',
          action: '',

          // id: 'S/N',
        },

        rowAttributesCallback(row) {
          if (row.studentship_status === 'left') {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          if (row.studentship_status === 'suspended') {
            return { style: 'background: #dfbe5d; color: #000000' }
          }
          // if (row.studentship_status === 'graduated') {
          //   return { style: 'background: #6610f2; color: #ffffff' }
          // }
          return { style: 'background: #36c15ecf; color: #000000' }
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'registration_no',
          'user.last_name',
          'user.first_name',
          'user.gender',
          'user.dob',
          'class_teacher.c_class.name',
          'admission_year',
          'parent_name',
          'parent_email',
        ],
        // filterable: false,
        filterable: [
          'registration_no',
          'user.last_name',
          'user.first_name',
          'user.gender',
          'user.dob',
          'class_teacher.c_class.name',
          'admission_year',
          'parent_name',
          'parent_phone',
          'parent_email',
        ],
      },
    }
  },
  methods: {
    checkRole,
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
    async loginAsUser(user) {
      await this.$store.dispatch('user/loginAsUser', { user_id: user.id })
      // this.$router.push('/login').catch(() => {})
      window.location = '/'
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
