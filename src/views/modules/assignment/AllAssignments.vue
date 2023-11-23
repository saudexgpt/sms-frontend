<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <el-card v-if="!mark_assignment">
      <!-- <div
        slot="header"
        class="clearfix"
      >
        <h3>View All Assignments</h3>
      </div> -->
      <el-row :gutter="5">
        <el-col
          :md="8"
          :sm="8"
          :xs="24"
        >

          <span class="demonstration">Select Class</span>
          <el-select
            v-model="class_teacher_id"
            style="width: 100%"
            filterable
            placeholder="Select Class"
          >
            <el-option
              v-for="(class_teacher, index) in class_teachers"
              :key="index"
              :value="class_teacher.id"
              :label="class_teacher.c_class.name"
            />
          </el-select>
        </el-col>
        <el-col
          :md="12"
          :sm="12"
          :xs="24"
        >

          <span class="demonstration">Select Date</span>
          <el-date-picker
            v-model="date_range"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="dd-MM-yyyy"
            :picker-options="pickerOptions"
            style="width: 100%"
          />
        </el-col>
        <el-col
          :md="4"
          :sm="4"
          :xs="24"
        >
          <span class="demonstration">&nbsp;</span>
          <button
            class="btn btn-primary"
            style="width: 100%"
            @click="fetchAssignments()"
          >Fetch
          </button>
        </el-col>
      </el-row>
      <br>
      <b-alert
        variant="primary"
        show
      >
        <div class="alert-body">
          Click on the + sign to view details
        </div>
      </b-alert>
      <v-client-table
        v-model="assignments"
        v-loading="load"
        :columns="columns"
        :options="options"
      >
        <div
          slot="child_row"
          slot-scope="{row}"
        >
          <aside>
            <legend>Assignment details</legend>
            <span v-html="row.assignment_details" />
          </aside>

        </div>
        <div
          slot="created_at"
          slot-scope="{row}"
        >{{ moment(row.created_at).format('MMM Do YYYY') }}
        </div>
        <div
          slot="deadline"
          slot-scope="{row}"
        >{{ moment(row.deadline).format('MMM Do YYYY [at] h:mm a') }}
        </div>
        <div
          slot="action"
          slot-scope="{row}"
          class="demo-inline-spacing"
        >
          <button
            class="btn btn-primary"
            @click="viewStudentResponses(row)"
          >
            Students' Responses
          </button>
        </div>
      </v-client-table>
    </el-card>
    <div v-if="mark_assignment">
      <button
        class="btn btn-danger"
        @click="mark_assignment = false"
      >
        Go Back
      </button>
      <mark-assignment
        :student-assignments="selected_student_assignments"
        :assignment-details="assignment_details"
        :can-score="false"
      />
    </div>
  </div>
</template>
<script>
import { BAlert } from 'bootstrap-vue'
import moment from 'moment'
import Resource from '@/api/resource'
import MarkAssignment from './MarkAssignment.vue'

export default {
  components: { BAlert, MarkAssignment },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          },
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          },
        },
        // {
        //   text: 'Last Term',
        //   onClick(picker) {
        //     const end = new Date()
        //     const start = new Date()
        //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        //     picker.$emit('pick', [start, end])
        //   },
        // }, {
        //   text: 'Last Year',
        //   onClick(picker) {
        //     const end = new Date()
        //     const start = new Date()
        //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
        //     picker.$emit('pick', [start, end])
        //   },
        // }
        ],
      },
      date_range: '',
      assignments: [],
      subject_teachers: [],
      subject_teacher_id: '',
      columns: [
        'subject_teacher.subject.name',
        'subject_teacher.class_teacher.c_class.name',
        'created_at',
        'deadline',
        'action',
      ],

      options: {
        headings: {
          'subject_teacher.subject.name': 'Subject',
          'subject_teacher.class_teacher.c_class.name': 'Class',
          created_at: 'Published',
          // action: 'Action',

          // id: 'S/N',
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      load: false,
      selected_student_assignments: [],
      assignment_details: '',
      mark_assignment: false,
      class_teachers: [],
      class_teacher_id: '',
    }
  },
  created() {
    this.fetchClasses()
  },
  methods: {
    moment,
    viewStudentResponses(row) {
      this.selected_student_assignments = row.student_assignments
      this.assignment_details = row.assignment_details
      this.mark_assignment = true
    },
    fetchClasses() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('school-setup/classes')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.class_teachers = response.class_teachers
        })
    },
    fetchAssignments() {
      const app = this
      app.load = true
      const date = app.date_range
      const param = { class_teacher_id: app.class_teacher_id, start_date: date[0], end_date: date[1] }
      const fetchTeacherSubjectResource = new Resource('assignment/all-assignments')
      fetchTeacherSubjectResource.list(param).then(response => {
        app.assignments = response.assignments
        app.load = false
      })
    },
    deleteAssignment(row) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to permanently delete this assignment?')) {
        const deleteAssignmentResource = new Resource('assignment/destroy')
        deleteAssignmentResource.destroy(row.id, row).then(() => {
          app.fetchAssignments()
        })
      }
    },
  },
}
</script>
