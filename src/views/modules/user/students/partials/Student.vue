<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4 v-if="level !== null">
            Students in {{ (level) ? level.level : ' all levels' }}
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
              @input="fetchStudents()"
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
        <b-col
          cols="3"
        >
          <span
            v-if="levels.length > 0"
          >
            <el-select
              id="level"
              v-model="level_index"
              style="width: 100%;"
              placeholder="Select Level"
              filterable
              @input="setLevel()"
            >
              <el-option
                label="All Levels"
                value="all"
              />
              <el-option
                v-for="(each_level, index) in levels"
                :key="index"
                :label="each_level.level"
                :value="index"
              />
            </el-select>
          </span>
        </b-col>
      </b-row>
      <hr>
    </div>
    <div v-loading="loading">
      <student-in-class-table
        v-if="students_in_class.length > 0"
        :students-in-class="students_in_class"
        :level="level"
        @reload="fetchStudents()"
      />
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
import StudentInClassTable from './StudentInClassTable.vue'

export default {
  components: {
    StudentInClassTable,
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
        'action',
        'studentship_status',
        'student.registration_no',
        'student.user.last_name',
        'student.user.first_name',
        'student.user.gender',
        'student.user.dob',
        'class_teacher.c_class.name',
        'student.admission_year',
        'parent_name',
        'parent_phone',
        'parent_email',
      ],

      options: {
        headings: {
          studentship_status: 'Studentship Status',
          'student.registration_no': 'Admission No',
          'student.user.last_name': 'Surname',
          'student.user.first_name': 'Other Names',
          'student.user.gender': 'Gender',
          'student.user.dob': 'DOB',
          'class_teacher.c_class.name': 'Class',
          'student.admission_year': 'Admission Year',
          parent_name: 'Parent Name',
          parent_phone: 'Parent Phone',
          parent_email: 'Parent Email',
          action: '',

          // id: 'S/N',
        },

        rowAttributesCallback(row) {
          if (row.student.studentship_status === 'left') {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          if (row.student.studentship_status === 'suspended') {
            return { style: 'background: #dfbe5d; color: #000000' }
          }
          // if (row.student.studentship_status === 'graduated') {
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
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'class_teacher.c_class.name',
          'student.admission_year',
          'parent_name',
          'parent_email',
        ],
        // filterable: false,
        filterable: [
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'class_teacher.c_class.name',
          'student.admission_year',
          'parent_name',
          'parent_phone',
          'parent_email',
        ],
      },
      students_in_class: [],
      levels: [],
      sessions: [],
      sess_id: '',
      staff: [],
      level_index: '',
      level: {},
      loading: false,
      editable_row: '',
      selected_row_index: '',
      selected_teacher: '',
    }
  },
  created() {
    this.fetchStudents()
  },
  methods: {
    fetchStudents() {
      const app = this
      const param = {
        level_id: (app.level !== '') ? app.level.id : '',
        sess_id: app.sess_id,
      }
      app.loading = true
      app.students_in_class = []
      const fetchStudentResource = new Resource('user-setup/all-students-table')
      fetchStudentResource.list(param)
        .then(response => {
          app.students_in_class = response.students_in_class
          app.levels = response.levels
          app.sessions = response.sessions
          // eslint-disable-next-line radix
          app.sess_id = parseInt(response.sess_id)
          app.loading = false
        })
    },
    setLevel() {
      const app = this
      if (app.level_index !== 'all') {
        app.level = app.levels[app.level_index]
      } else {
        app.level = { id: 'all', level: ' all levels' }
      }
      this.fetchStudents()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
