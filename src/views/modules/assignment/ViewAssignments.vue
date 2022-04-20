<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <el-card v-if="!mark_assignment">
      <el-col :xs="24">
        <el-select
          v-model="subject_teacher_id"
          style="width: 100%"
          placeholder="Select Subject"
          @input="fetchAssignments()"
        >
          <el-option
            v-for="(subject_teacher, index) in subject_teachers"
            :key="index"
            :label="subject_teacher.subject.name +' for ' + subject_teacher.class_teacher.c_class.name"
            :value="subject_teacher.id"
          /></el-select>
      </el-col>
      <h4>Click on the + sign to view details</h4>
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
            Mark
          </button>
          <button
            class="btn btn-danger"
            @click="deleteAssignment(row)"
          >
            Delete
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
        :can-score="true"
      />
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
import MarkAssignment from './MarkAssignment.vue'

export default {
  components: { MarkAssignment },
  data() {
    return {
      assignments: [],
      subject_teachers: [],
      subject_teacher_id: '',
      columns: [
        'subject_teacher.class_teacher.c_class.name',
        'created_at',
        'deadline',
        'action',
      ],

      options: {
        headings: {
          'subject_teacher.class_teacher.c_class.name': 'Class',
          created_at: 'Published',
          action: 'Action',

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
    }
  },
  created() {
    this.fetchSubjects()
  },
  methods: {
    moment,
    viewStudentResponses(row) {
      this.selected_student_assignments = row.student_assignments
      this.assignment_details = row.assignment_details
      this.mark_assignment = true
    },
    fetchSubjects() {
      const app = this
      const fetchTeacherSubjectResource = new Resource('assignment/fetch-subjects')
      fetchTeacherSubjectResource.list().then(response => {
        app.subject_teachers = response.subject_teachers
      })
    },
    fetchAssignments() {
      const app = this
      app.load = true
      const param = { subject_teacher_id: app.subject_teacher_id }
      const fetchTeacherSubjectResource = new Resource('assignment/view-assignment')
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
