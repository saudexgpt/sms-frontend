<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <span>My Assignments</span>
      </div>
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
          slot-scope="props"
        >
          <div class="pull-right">
            <b-button
              v-if="props.row.is_marked === 0"
              variant="primary"
              @click="viewStudentResponses(props.row)"
            >
              Attempt
            </b-button>
            <b-button
              v-else
              variant="success"
              @click="viewStudentResponses(props.row)"
            >
              View Remark
            </b-button>
          </div>
          <div style="background: #fdd2cc; padding: 10px; border-radius: 5px">
            <legend>Assignment details</legend>
            <span v-html="props.row.assignment_details" />
          </div>
          <div
            v-if="modalShow && selected_assignment.id === props.row.id"
            v-loading="loadModal"
          >
            <div
              v-if="can_edit"
            >
              <h4>Type your answer</h4>
              <quill-editor
                v-model="selected_assignment.form.student_answer"
              />
              <b-button
                variant="danger"
                @click="submitAssignment()"
              >
                Submit
              </b-button>
            </div>
            <div v-else>
              <div v-if="selected_assignment.student_assignment !== null">
                Your Score: <br>
                <strong>{{ selected_assignment.student_assignment.score }}</strong><br>
                Teacher's Score:
                <strong>{{ selected_assignment.student_assignment.remark }}</strong>
                Your Answer: <br>
                <span v-html="selected_assignment.student_assignment.student_answer" />
              </div>
              <div v-else>
                <el-alert
                  :closable="false"
                  type="error"
                >
                  This assignment is awaiting teacher's response
                </el-alert>
              </div>
            </div>
          </div>
        </div>
        <div
          slot="teacher"
          slot-scope="{row}"
        >{{ row.subject_teacher.staff.user.first_name + ' ' + row.subject_teacher.staff.user.last_name }}
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
          <b-button
            v-if="row.is_marked === '0'"
            variant="outline-primary"
            @click="viewStudentResponses(row)"
          >
            Attempt
          </b-button>
          <b-button
            v-else
            variant="outline-success"
            @click="viewStudentResponses(row)"
          >
            View Details
          </b-button>
        </div>
      </v-client-table>
    </el-card>
    <!-- <b-modal
      v-model="modalShow"
      ok-only
      ok-title="Submit"
      centered
      size="lg"
      title="Attempt Assignment"
      scrollable
      @ok="submitAssignment()"
    >
      <b-card-text>
        <div>
          <span v-html="selected_assignment.assignment_details" />
        </div>
        <div
          v-if="can_edit"
          v-loading="loadModal"
        >
          <h4>Type your answer</h4>
          <quill-editor
            v-model="form.student_answer"
          />
        </div>
        <div v-else>
          <div v-if="student_assignment !== null">
            Your Score: <br>
            <strong>{{ student_assignment.score }}</strong><br>
            Teacher's Score:
            <strong>{{ student_assignment.remark }}</strong>
            Your Answer: <br>
            <span v-html="student_assignment.student_answer" />
          </div>
          <div v-else>
            <el-alert
              :closable="false"
              type="error"
            >
              This assignment is awaiting teacher's response
            </el-alert>
          </div>
        </div>
      </b-card-text>
    </b-modal> -->
  </div>
</template>
<script>
import {
  BAlert, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import moment from 'moment'
// eslint-disable-next-line
import 'quill/dist/quill.core.css'
// eslint-disable-next-line
import 'quill/dist/quill.snow.css'
// eslint-disable-next-line
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import Resource from '@/api/resource'

export default {
  components: {
    BAlert, BButton, quillEditor,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      assignments: [],
      subject_teachers: [],
      subject_teacher_id: '',
      columns: [
        'subject_teacher.subject.name',
        'teacher',
        'created_at',
        'deadline',
        // 'action',
      ],

      options: {
        headings: {
          'subject_teacher.subject.name': 'Subject',
          created_at: 'Published',
          action: 'Action',

          // id: 'S/N',
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      load: false,
      modalShow: false,
      loadModal: false,
      form: {
        student_answer: '',
      },
      selected_assignment: {
        form: {
          student_answer: '',
        },
        student_assignment: '',
      },
      can_edit: false,
    }
  },
  created() {
    this.fetchAssignments()
  },
  methods: {
    moment,
    viewStudentResponses(selectedAssignment) {
      const app = this
      app.selected_assignment = selectedAssignment
      app.selected_assignment.form = { student_answer: '' }
      app.selected_assignment.student_assignment = ''
      app.loadModal = true
      const fetchTeacherSubjectResource = new Resource('assignment/student/answer')
      fetchTeacherSubjectResource.get(selectedAssignment.id).then(response => {
        app.can_edit = response.can_edit
        app.selected_assignment.student_assignment = response.assignment_to_tackle
        app.selected_assignment.form.student_answer = (app.selected_assignment.student_assignment) ? app.selected_assignment.student_assignment.student_answer : ''
        app.loadModal = false
      })
      this.modalShow = true
    },
    submitAssignment() {
      const app = this
      const fetchTeacherSubjectResource = new Resource('assignment/student/assignments/tackle')
      const param = {
        assignment_id: app.selected_assignment.id,
        student_answer: app.selected_assignment.form.student_answer,

      }
      app.loadModal = true
      fetchTeacherSubjectResource.store(param).then(() => {
        app.fetchAssignments()
        app.loadModal = false
        this.modalShow = false
      })
    },
    // fetchSubjects() {
    //   const app = this
    //   const fetchTeacherSubjectResource = new Resource('assignment/fetch-subjects')
    //   fetchTeacherSubjectResource.list().then(response => {
    //     app.subject_teachers = response.subject_teachers
    //   })
    // },
    fetchAssignments() {
      const app = this
      app.load = true
      // const param = { subject_teacher_id: app.subject_teacher_id }
      const fetchTeacherSubjectResource = new Resource('assignment/student/assignments')
      fetchTeacherSubjectResource.list().then(response => {
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
    hasExpired(date) {
      const today = new Date()
      if (date < today) {
        return true
      }
      return false
    },
  },
}
</script>
