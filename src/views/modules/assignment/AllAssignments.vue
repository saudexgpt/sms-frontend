<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card>
    <div
      slot="header"
      class="clearfix"
    >
      <h3>View All Assignments</h3>
    </div>
    <el-row :gutter="5">
      <el-col
        :md="20"
        :sm="20"
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
      <!-- <div
        slot="action"
        slot-scope="{row}"
        class="demo-inline-spacing"
      >
        <button
          class="btn btn-primary"
          @click="viewStudentResponses(row)"
        >
          Mark
        </button>
        <button
          class="btn btn-danger"
          @click="deleteAssignment(row)"
        >
          Delete
        </button>
      </div> -->
    </v-client-table>
  </el-card>
</template>
<script>
import { BAlert } from 'bootstrap-vue'
import moment from 'moment'
import Resource from '@/api/resource'

export default {
  components: { BAlert },
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
        }, {
          text: 'Last Term',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        }, {
          text: 'Last Year',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          },
        }],
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
        // 'action',
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
      mark_assignment: false,
    }
  },
  created() {
    // this.fetchAssignments()
  },
  methods: {
    moment,
    viewStudentResponses(row) {
      this.selected_student_assignments = row.student_assignments
      this.mark_assignment = true
    },
    fetchAssignments() {
      const app = this
      app.load = true
      const date = app.date_range
      const param = { start_date: date[0], end_date: date[1] }
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
