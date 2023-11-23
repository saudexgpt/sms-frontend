<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div
      slot="header"
      class="clearfix"
    >
      <span><strong>List of Potential Schools</strong></span>
      <b-button
        style="float: right;"
        variant="primary"
      >
        <router-link
          to="/schools/register"
          style="color: #fff;"
        >
          Register New
        </router-link>
      </b-button>
    </div>
    <hr>
    <v-client-table
      v-model="schools"
      v-loading="load"
      :columns="columns"
      :options="options"
    >
      <div
        slot="logo"
        slot-scope="{row}"
      >
        <img
          :src="'/'+row.logo"
          width="100"
        >
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
        <span v-if="checkRole(['super'])">
          <!-- <b-button
            v-b-tooltip.hover.right="'View Details'"
            variant="primary"
            class="btn-icon rounded-circle"
          >

            <router-link
              :to="{name: 'schoolDetails', params: {id: props.row.id}}"
              style="color: #fff;"
            ><feather-icon icon="EyeIcon" /></router-link>
          </b-button> -->
          <b-button
            v-b-tooltip.hover.right="'Approve ' + props.row.name"
            variant="primary"
            class="btn-icon rounded-circle"
            @click="confirmSchool(props.row.id)"
          >
            <feather-icon icon="CheckIcon" />
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
import moment from 'moment'
import { avatarText } from '@core/utils/filter'
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
      columns: [
        'action',
        // 'logo',
        'name',
        'slug',
        'email',
        'phone',
        'estimated_no_of_students',
        'curriculum',
        'admin_first_name',
        'admin_last_name',
        'admin_email',
        'admin_phone1',
        'created_at',
      ],

      options: {
        headings: {
          estimated_no_of_students: 'Estimated Students Population',
          created_at: 'Date Registered',
          admin_phone1: 'Phone',
          action: '',
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
    checkRole,
    avatarText,
    fetchSchools() {
      const app = this
      app.load = true
      let fetchSchoolsResource = new Resource('schools/potential')
      if (app.role === 'partner') {
        fetchSchoolsResource = new Resource('schools/partner-potential-schools')
      }
      fetchSchoolsResource.list()
        .then(response => {
          app.schools = response.potential_schools
          app.load = false
        }).catch(error => {
          app.$message(error.response.data.message)
          app.load = false
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
          }
        }).catch(error => {
          app.$message(error.response.data.message)
        })
    },
    confirmSchool(schoolId) {
      const app = this
      const param = { school_id: schoolId }
      app.load = true
      const confirmSchoolResource = new Resource('schools/confirm-potential-school')
      confirmSchoolResource.store(param)
        .then(response => {
          console.log(response)
          app.load = false
        }).catch(error => {
          app.$message(error.response.data.message)
          app.load = false
        })
    },
  },
}
</script>
