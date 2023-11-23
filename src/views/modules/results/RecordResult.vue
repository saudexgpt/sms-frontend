<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>
            Record Result
          </h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="modalShow = true;"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Set Preferences</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <!--SIDEBAR MODAL-->
    <b-sidebar
      v-model="modalShow"
      sidebar-subject="sidebar-lg"
      :visible="modalShow"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
    >
      <template
        #default="{ hide }"
      >
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Set Preferences for Result
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div
          v-loading="load"
          class="justify-content-between align-items-center px-2 py-1"
        >
          <b-form-group>
            <label>Select Subject</label>
            <el-select
              v-model="form.subject_teacher_id"
              placeholder="Select Subject"
              class="span"
              filterable
            >
              <el-option
                v-for="(subject_teacher, index) in subject_teachers"
                :key="index"
                :value="subject_teacher.id"
                :label="subject_teacher.subject.code+' for '+subject_teacher.class_teacher.c_class.name"
              />

            </el-select>
            <div
              v-if="subject_teachers.length < 1"
              class="label label-danger padded"
            >
              No subject is assigned to you. Inform your school administrator
            </div>
          </b-form-group>
          <b-form-group>
            <label>Session</label>
            <el-select
              v-model="form.sess_id"
              placeholder="Select Session"
              class="span"
            >
              <el-option
                v-for="(session, index) in sessions"
                :key="index"
                :value="session.id"
                :label="session.name"
              />

            </el-select>
          </b-form-group>
          <b-form-group>
            <label>Term</label>
            <el-select
              v-model="form.term_id"
              placeholder="Select Term"
              class="span"
            >
              <el-option
                v-for="(term, index) in terms"
                :key="index"
                :value="term.id"
                :label="term.name"
              />

            </el-select>
          </b-form-group>
          <b-form-group>
            <label>Sub Term</label>
            <el-select
              v-model="form.sub_term"
              placeholder="Select Sub-term"
              class="span"
            >
              <el-option
                value="half"
                label="Mid Term"
              />
              <el-option
                value="full"
                label="Full Term"
              />
            </el-select>
          </b-form-group>
          <b-form-group>
            <hr>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="recordResultData()"
            >
              Submit Preferences
            </b-button>
          </b-form-group>
        </div>
      </template>
    </b-sidebar>
    <!--SIDEBAR MODAL-->
    <div v-if="show_table">
      <el-button
        v-if="studentData"
        @click="normalizeResult()"
      >
        Normalize
      </el-button>
      <subject-students-table
        :student-data="studentData"
        :form="form"
      />
    </div>
    <div v-else>
      <b-alert
        variant="danger"
        show
      >
        <div class="alert-body">
          <span><strong>Please set your preferences to record result</strong></span>
        </div>
      </b-alert>
    </div>
  </el-card>
</template>
<script>
import {
  BSidebar, BButton, BFormGroup, BAlert, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import SubjectStudentsTable from './partials/SubjectStudentsTable.vue'

const selectionOptions = new Resource('result/set-selection-options')
const recordStudentResult = new Resource('result/get-subject-students')

export default {
  components: {
    BSidebar, BButton, BFormGroup, BAlert, BRow, BCol, SubjectStudentsTable,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      modalShow: true,
      studentData: {},

      form: {
        sess_id: '',
        term_id: '',
        sub_term: '',
        csv: '',
        subject_teacher_id: '',
      },

      sessions: [],
      terms: [],
      subject_teachers: [],

      show_table: false,
      load: false,
      display_label: '',
    }
  },

  created() {
    this.setSelectionOptions()
  },
  methods: {
    setSelectionOptions() {
      const app = this
      app.load = true
      selectionOptions.list()
        .then(response => {
          app.load = false
          app.sessions = response.sessions
          app.terms = response.terms
          app.subject_teachers = response.subject_teachers
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },

    normalizeResult() {
      const app = this
      const { subject_teacher_id } = app.studentData
      const { sess_id } = app.form
      const { term_id } = app.form
      const { sub_term } = app.form
      const params = {
        subject_teacher_id, sess_id, term_id, sub_term,
      }
      // eslint-disable-next-line no-alert
      if (window.confirm('This will normalize the entries based on Result Settings. Click OK to continue')) {
        const normalizeStudentResult = new Resource('result/normalize-result')
        normalizeStudentResult.store(params)
          .then(() => {
            // alert('saved')
            app.recordResultData()
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    recordResultData() {
      const app = this
      const param = app.form
      app.load = true
      recordStudentResult.list(param)
        .then(response => {
          app.studentData = response
          app.show_table = true
          app.modalShow = false
          app.load = false
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
