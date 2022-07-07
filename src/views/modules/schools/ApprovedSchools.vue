<!-- eslint-disable vue/no-v-html -->
<template>
  <div>

    <div
      slot="header"
      class="clearfix"
    >
      <span><strong>List of Approved Schools</strong></span>
      <!-- <el-button
        style="float: right; padding: 3px 0"
        type="text"
      >
        Register New
      </el-button> -->
    </div>
    <hr>
    <el-tabs>
      <el-tab-pane
        label="Active"
      >

        <v-client-table
          v-model="activeSchools"
          v-loading="load"
          :columns="columns"
          :options="options"
        >
          <div
            slot="logo"
            slot-scope="{row}"
          >
            <img
              :src="baseServerUrl +'storage/'+row.logo"
              width="100"
            >
          </div>
          <div
            slot="suspended_for_nonpayment"
            slot-scope="props"
          >
            <div
              v-if="checkRole(['super'])"
            >

              <el-select
                v-model="props.row.suspended_for_nonpayment"
                style="width: 100%"
                @input="toggleSuspensionStatus(props, $event)"
              >
                <el-option
                  label="Active"
                  :value="0"
                />
                <el-option
                  label="Suspended"
                  :value="1"
                />
              </el-select>
            </div>
            <div v-else>
              {{ (props.row.suspended_for_nonpayment === 0) ? 'Active' : 'Suspended' }}
            </div>
          </div>
          <div
            slot="created_at"
            slot-scope="{row}"
          >{{ moment(row.created_at).format('MMM Do YYYY') }}
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
                  :to="{name: 'schoolDetails', params: {id: props.row.id}}"
                  style="color: #fff;"
                ><feather-icon icon="EyeIcon" /></router-link>
              </b-button>
            </span>
            <!-- <span
          v-if="checkPermission(['can manage schools'])"
        >
          <b-button
            v-b-tooltip.hover.right="'Reset Password'"
            variant="warning"
            class="btn-icon rounded-circle"
            @click="resetPassword(props.row.student.user)"
          >
            <feather-icon icon="UnlockIcon" />
          </b-button>
        </span> -->
            <span
              v-if="checkPermission(['can manage schools'])"
            >
              <b-button
                v-b-tooltip.hover.right="'Login as admin of ' + props.row.name"
                variant="dark"
                class="btn-icon rounded-circle"
                @click="loginToASchool(props.row)"
              >
                <feather-icon icon="KeyIcon" />
              </b-button>
            </span>
          </div>
        </v-client-table>
      </el-tab-pane>
      <el-tab-pane
        label="Suspended"
      >

        <v-client-table
          v-model="suspendedSchools"
          v-loading="load"
          :columns="columns"
          :options="options"
        >
          <div
            slot="logo"
            slot-scope="{row}"
          >
            <img
              :src="baseServerUrl +'storage/'+row.logo"
              width="100"
            >
          </div>
          <div
            slot="suspended_for_nonpayment"
            slot-scope="props"
          >
            <div
              v-if="checkRole(['super'])"
            >

              <el-select
                v-model="props.row.suspended_for_nonpayment"
                style="width: 100%"
                @input="toggleSuspensionStatus(props, $event)"
              >
                <el-option
                  label="Active"
                  :value="0"
                />
                <el-option
                  label="Suspended"
                  :value="1"
                />
              </el-select>
            </div>
            <div v-else>
              {{ (props.row.suspended_for_nonpayment === 0) ? 'Active' : 'Suspended' }}
            </div>
          </div>
          <div
            slot="created_at"
            slot-scope="{row}"
          >{{ moment(row.created_at).format('MMM Do YYYY') }}
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
                  :to="{name: 'schoolDetails', params: {id: props.row.id}}"
                  style="color: #fff;"
                ><feather-icon icon="EyeIcon" /></router-link>
              </b-button>
            </span>
            <!-- <span
          v-if="checkPermission(['can manage schools'])"
        >
          <b-button
            v-b-tooltip.hover.right="'Reset Password'"
            variant="warning"
            class="btn-icon rounded-circle"
            @click="resetPassword(props.row.student.user)"
          >
            <feather-icon icon="UnlockIcon" />
          </b-button>
        </span> -->
            <span
              v-if="checkPermission(['can manage schools'])"
            >
              <b-button
                v-b-tooltip.hover.right="'Login as admin of ' + props.row.name"
                variant="dark"
                class="btn-icon rounded-circle"
                @click="loginToASchool(props.row)"
              >
                <feather-icon icon="KeyIcon" />
              </b-button>
            </span>
          </div>
        </v-client-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  BButton, VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import moment from 'moment'
import { avatarText } from '@core/utils/filter'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Resource from '@/api/resource'

export default {
  components: { BButton },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    role: {
      type: String,
      default: 'admin',
    },
  },
  data() {
    return {
      schools: [],
      activeSchools: [],
      suspendedSchools: [],
      columns: [
        'action',
        'suspended_for_nonpayment',
        'id',
        'logo',
        'name',
        'email',
        'phone',
        'curriculum',
        'created_at',
      ],

      options: {
        headings: {
          suspended_for_nonpayment: 'Current Status',
          created_at: 'Date Confirmed',
          action: '',

          id: 'ID',
        },
        rowAttributesCallback(row) {
          if (row.suspended_for_nonpayment === 1) {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          return { style: 'background: #36c15ecf; color: #000000' }
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      load: false,
      selected_student_schools: [],
      mark_assignment: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchSchools()
  },
  methods: {
    moment,
    checkPermission,
    checkRole,
    avatarText,
    fetchSchools() {
      const app = this
      app.load = true
      let fetchSchoolsResource = new Resource('schools')
      if (app.role === 'partner') {
        fetchSchoolsResource = new Resource('schools/partner-schools')
      }
      fetchSchoolsResource.list()
        .then(response => {
          app.schools = response.schools
          app.filterActiveSchools()
          app.load = false
        }).catch(error => {
          app.$message(error.response.data.message)
          app.load = false
        })
    },
    filterActiveSchools() {
      const app = this
      app.suspendedSchools = []
      app.ctiveSchools = []
      app.schools.forEach(school => {
        if (school.suspended_for_nonpayment === 1) {
          app.suspendedSchools.push(school)
        } else {
          app.activeSchools.push(school)
        }
      })
    },
    async loginToASchool(school) {
      await this.$store.dispatch('user/loginToASchool', { school_id: school.id })
      // this.$router.push('/login').catch(() => {})
      window.location = '/'
    },
    toggleSuspensionStatus(props, event) {
      const app = this
      const changeSchoolStatusResource = new Resource('schools/toggle-school-non-payment-suspension')
      const param = { school_id: props.row.id, status: event }
      changeSchoolStatusResource.store(param)
        .then(response => {
          if (response === 'success') {
            app.schools[props.index - 1].suspended_for_nonpayment = event
            app.filterActiveSchools()
          }
        }).catch(error => {
          app.$message(error.response.data.message)
        })
    },
  },
}
</script>
