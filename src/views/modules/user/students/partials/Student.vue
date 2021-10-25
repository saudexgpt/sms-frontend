<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="7"
        >
          <h4 v-if="level !== ''">
            Students in {{ level.level }}
          </h4>
        </b-col>
        <b-col
          cols="5"
        >
          <span
            v-if="levels.length > 0"
          >
            <v-select
              v-model="level"
              placeholder="Select Level"
              :options="levels"
              label="level"
              value="id"
              @input="fetchStudents()"
            />
          </span>
        </b-col>
      </b-row>
      <hr>
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
      <!-- <v-client-table
        v-model="students_in_class"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="studentship_status"
          slot-scope="{row}"
        >{{ (row.student.studentship_status === 'left') ? 'withdrawn' : row.student.studentship_status }}
        </div>
        <div
          slot="parent_name"
          slot-scope="{row}"
        >{{ row.student.student_guardian.guardian.user.first_name + ' ' + row.student.student_guardian.guardian.user.last_name }}
        </div>
        <div
          slot="parent_phone"
          slot-scope="{row}"
        >{{ row.student.student_guardian.guardian.user.phone1 + ' | ' + row.student.student_guardian.guardian.user.phone2 }}
        </div>
        <div
          slot="parent_email"
          slot-scope="{row}"
        >{{ row.student.student_guardian.guardian.user.email }}
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
                :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                style="color: #fff;"
              ><feather-icon icon="EyeIcon" /></router-link>
            </b-button>
            <b-button
              v-b-tooltip.hover.right="'Reset Password'"
              variant="warning"
              class="btn-icon rounded-circle"
              @click="resetPassword(props.row.student.user)"
            >
              <feather-icon icon="UnlockIcon" />
            </b-button>
            <b-button
              v-b-tooltip.hover.right="'Login as ' + props.row.student.user.first_name"
              variant="dark"
              class="btn-icon rounded-circle"
              @click="loginAsUser(props.row.student.user)"
            >
              <feather-icon icon="KeyIcon" />
            </b-button>
          </span>
        </div>
      </v-client-table> -->
      <student-in-class-table :students-in-class="students_in_class" />
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import StudentInClassTable from './StudentInClassTable.vue'

export default {
  components: {
    StudentInClassTable,
    // VueGoodTable,
    vSelect,
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
      staff: [],
      level: '',
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
        level_id: (app.level) ? app.level.id : '',
      }
      app.loading = true
      const fetchStudentResource = new Resource('user-setup/all-students-table')
      fetchStudentResource.list(param)
        .then(response => {
          app.students_in_class = response.students_in_class
          app.levels = response.levels
          app.level = response.level
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
