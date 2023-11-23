<template>

  <b-card>

    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <label for="">Select Subject</label>
          <el-select
            v-model="subject_teacher_id"
            style="width: 100%;"
            placeholder="Select Subject"
            filterable
            @input="fetchQuestionBank()"
          >
            <el-option
              v-for="(subjectTeacher, index) in subject_teachers"
              :key="index"
              :label="`${subjectTeacher.subject.name.toUpperCase()} ${subjectTeacher.class_teacher.c_class.name}`"
              :value="subjectTeacher.id"
            />
          </el-select>
        </b-col>
        <b-col
          cols="6"
        >
          <label for="">Select Question Type</label>
          <el-select
            v-model="option.question_type"
            style="width: 100%;"
            placeholder="Select Question Type"
          >
            <el-option
              label="OBJECTIVE QUESTIONS"
              value="objective"
            />
            <!-- <el-option
              label="THEORY QUESTIONS"
              value="theory"
            /> -->
          </el-select>
        </b-col>
      </b-row>
      <hr>
    </div>
    <b-tabs
      pills
      content-class="mt-1"
    >
      <!-- This tabs content will always be mounted -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>Question Bank</span>
        </template>
        <div v-loading="load">
          <div v-if="option.question_type=='objective'">
            <obj-questions
              v-if="subject_teacher !== ''"
              :subject-teacher="subject_teacher"
              :option="option"
              @display="displayForm"
              @reload="fetchQuestionBank"
            />
          </div>
          <!-- <div v-if="option.question_type=='theory'">
            <theory-questions
              v-if="subject_teacher !== ''"
              :subject-teacher="subject_teacher"
              :option="option"
              @display="displayForm"
              @reload="fetchQuestionBank"
            />
          </div> -->
        </div>
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="PlusIcon" />
          <span>Add A Question</span>
        </template>
        <add-objective-question
          :subject-teacher="subject_teacher"
          :option="option"
        />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UploadIcon" />
          <span>Upload Bulk Questions</span>
        </template>
        <upload-bulk-questions />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UploadIcon" />
          <span>Set Exam</span>
        </template>
        <h4
          v-if="subject_teacher !== ''"
          class="box-title"
        >
          Examination for {{ subject_teacher.subject.name }} ({{ subject_teacher.class_teacher.c_class.name }})
        </h4>
        <set-quiz
          :subject-teacher="subject_teacher"
          @reload="$emit('reload')"
        />
      </b-tab>
    </b-tabs>

  </b-card>
</template>
<script>
import {
  BTabs, BTab, BCard, BRow, BCol,
} from 'bootstrap-vue'
import Resource from '@/api/resource'
import ObjQuestions from './partials/objective/ObjQuestions.vue'
// import TheoryQuestions from './partials/theory/TheoryQuestions.vue'
import UploadBulkQuestions from './UploadBulkQuestions.vue'
import AddObjectiveQuestion from './partials/objective/AddObjectiveQuestion.vue'
import SetQuiz from './partials/objective/SetQuiz.vue'

export default {
  components: {
    BTabs,
    BTab,
    BCard,
    BRow,
    BCol,
    ObjQuestions,
    // TheoryQuestions,
    UploadBulkQuestions,
    AddObjectiveQuestion,
    SetQuiz,
  },
  data() {
    return {
      subject_teachers: [],
      subject_teacher_id: '',
      option: {
        question_type: 'objective',
      },
      load: false,
      subject_teacher: '',
      display_form: true,
    }
  },
  created() {
    this.subjectTeachers()
  },
  methods: {
    subjectTeachers() {
      const app = this
      app.load = true
      const subjectTeacherDashboard = new Resource('lms/subject-teachers')
      subjectTeacherDashboard.list() // back end route from web.php

        .then(response => {
          app.subject_teachers = response.subject_teachers
          app.load = false
        })
    },
    fetchQuestionBank() {
      const app = this
      app.load = true
      const fetchQuestionBankResource = new Resource('lms/fetch-questions-bank')
      fetchQuestionBankResource.get(app.subject_teacher_id) // back end route from web.php

        .then(response => {
          app.subject_teacher = response.subject_teacher
          app.load = false
        })
    },
    displayForm(status) {
      this.display_form = status
    },
  },
}
</script>
