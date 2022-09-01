<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4 v-if="sess_id !== ''">
            List of Alumni
          </h4>
        </b-col>
        <b-col
          cols="3"
        >
          <span
            v-if="sessions.length > 0"
          >
            <el-select
              id="sess_id"
              v-model="sess_id"
              style="width: 100%;"
              placeholder="Select Session"
              filterable
              @input="fetchAlumni()"
            >
              <el-option
                v-for="(session) in sessions"
                :key="session.id"
                :label="session.name"
                :value="session.id"
              />
            </el-select>
          </span>
        </b-col>
      </b-row>
      <hr>
    </div>
    <div v-loading="loading">

      <el-button
        v-if="alumni.length > 0"
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="document"
        @click="handleDownload('List of Alumni', alumni)"
      >Export Excel</el-button>
      <v-client-table
        v-model="alumni"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <template
          slot="student.registration_no"
          slot-scope="props"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="Click to change photo"
            placement="bottom-start"
          >
            <div
              align="center"
              @click="changePhoto(props.index, props.row.student.user)"
            >
              <img
                align="center"
                :src="baseServerUrl +'storage/'+ props.row.student.user.photo"
                alt="Photo"
                width="70"
              >
              <p>{{ props.row.student.registration_no }}</p>
            </div>
          </el-tooltip>
        </template>
        <template
          slot="graduate_session"
          slot-scope="props"
        >
          <div>{{ props.row.graduate_session.name }}</div>
        </template>
      </v-client-table>
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    // BButton,
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
        'student.registration_no',
        'student.user.last_name',
        'student.user.first_name',
        'student.user.gender',
        'student.user.dob',
        'student.admission_year',
        'graduate_session',
        'student.studentship_status',
      ],

      options: {
        headings: {
          studentship_status: 'Studentship Status',
          'student.registration_no': 'Admission No',
          'student.user.last_name': 'Surname',
          'student.user.first_name': 'Other Names',
          'student.user.gender': 'Gender',
          'student.user.dob': 'DOB',
          'student.admission_year': 'Admission Year',
          graduate_session: 'Graduation Session',
          'student.studentship_status': 'Status',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'student.admission_year',
        ],
        // filterable: false,
        filterable: [
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'student.admission_year',
        ],
      },
      alumni: [],
      sessions: [],
      sess_id: '',
      level_index: '',
      level: '',
      loading: false,
      editable_row: '',
      selected_row_index: '',
      selected_teacher: '',
      downloadLoading: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchAlumni()
  },
  methods: {
    fetchAlumni() {
      const app = this
      const param = {
        sess_id: app.sess_id,
      }
      app.loading = true
      app.alumni = []
      const fetchAlumniResource = new Resource('user-setup/fetch-alumni')
      fetchAlumniResource.list(param)
        .then(response => {
          app.alumni = response.alumni
          app.sessions = response.sessions
          app.loading = false
        })
    },
    handleDownload(tableTitle, studentList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'ADMISSION NO',
          'SURNAME',
          'OTHER NAMES',
          'GENDER',
          'DOB',
          'ADMISSION YR',
          'GRADUATION SESSION',
          'STATUS',
        ]
        const filterVal = [
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'student.admission_year',
          'graduate_session',
          'student.studentship_status',
        ]
        const list = studentList
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
        // if (j === 'studentship_status') {
        //   return (v.student.studentship_status === 'left') ? 'WITHDRAWN' : v.student.studentship_status.toUpperCase()
        // }
        if (j === 'student.registration_no') {
          return v.student.registration_no
        }
        if (j === 'student.user.last_name') {
          return v.student.user.last_name
        }
        if (j === 'student.user.first_name') {
          return v.student.user.first_name
        }
        if (j === 'student.user.gender') {
          return v.student.user.gender
        }
        if (j === 'student.user.dob') {
          return v.student.user.dob
        }
        if (j === 'graduate_session') {
          return v.graduate_session.name
        }
        if (j === 'student.admission_year') {
          return v.student.admission_year
        }
        if (j === 'student.studentship_status') {
          return v.student.studentship_status
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
