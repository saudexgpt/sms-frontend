<template>
  <b-card>
    <b-tabs
      content-class="mt-1"
    >
      <!-- This tabs content will always be mounted -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>Examination Details</span>
        </template>
        <div v-loading="load">
          <div
            v-if="class_teachers.length > 0"
            class="box"
          >
            <div
              v-if="!set_question"
              class="box-body"
            >
              <el-row>
                <el-col
                  :xs="24"
                  :sm="24"
                  :md="12"
                  :lg="12"
                  :xl="12"
                >
                  <span>Select Class to view</span>
                  <!-- small box -->
                  <el-select
                    v-model="class_teacher_id"
                    style="width: 100%"
                    @input="fetchQuizzes()"
                  >
                    <el-option
                      v-for="(each_class_teacher,index) in class_teachers"
                      :key="index"
                      :value="each_class_teacher.id"
                      :label="each_class_teacher.c_class.name"
                    />
                  </el-select>
                </el-col>
              </el-row>
              <el-row
                v-if="class_teacher != ''"
                :gutter="10"
              >
                <h3>Subjects in {{ class_teacher.c_class.name }}</h3>
                <el-col
                  v-for="(each_subject_teacher, index) in class_teacher.subject_teachers"
                  :key="index"
                  :xs="12"
                  :sm="8"
                  :md="6"
                  :lg="4"
                  :xl="2"
                >
                  <b-card
                    class="text-center"
                    :style="'cursor: pointer; color: #ffffff; background: ' + each_subject_teacher.subject.color_code"
                    @click="setSubjectQuestion(each_subject_teacher)"
                  >
                    <div class="truncate">
                      <strong>{{ each_subject_teacher.subject.code.toUpperCase() }}</strong>
                      <p>{{ class_teacher.c_class.name }}</p>
                    </div>
                  </b-card>
                </el-col>
              </el-row>
            </div>

            <div v-if="set_question">
              <span class="">
                <el-button
                  @click="set_question=false"
                ><i class="fa fa-list" /> Subject List</el-button></span>
              <!-- <subject-questions :subject_teacher="subject_teacher" /> -->
              <view-teacher-quiz :subject-teacher="subject_teacher" />
            </div>
          </div>
        </div>
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="UploadIcon" />
          <span>Upload Bulk Questions</span>
        </template>
        <upload-bulk-questions />
      </b-tab>
    </b-tabs>
  </b-card>
</template>
<script>
import { BTabs, BTab, BCard } from 'bootstrap-vue'
import Resource from '@/api/resource'
import ViewTeacherQuiz from './partials/ViewTeacherQuiz.vue'
import UploadBulkQuestions from './UploadBulkQuestions.vue'

const quizDashboard = new Resource('lms/quiz-dashboard')
const classesResource = new Resource('school-setup/classes')
export default {
  components: {
    BTabs, BTab, ViewTeacherQuiz, BCard, UploadBulkQuestions,
  },
  data() {
    return {
      class_teachers: [],
      class_teacher: '',
      subject_teacher: {},
      set_question: false,
      load: false,
      class_teacher_id: '',
    }
  },
  mounted() {
    this.fetchClasses()
  },
  methods: {
    fetchClasses() {
      const app = this
      app.load = true
      classesResource.list() // back end route from web.php

        .then(response => {
          app.load = false
          app.class_teachers = response.class_teachers
        }).catch(() => {
          app.load = false
        })
    },
    fetchQuizzes() {
      const app = this
      app.load = true
      quizDashboard.list({ class_teacher_id: app.class_teacher_id }) // back end route from web.php

        .then(response => {
          app.load = false
          app.class_teacher = response.class_teacher
        }).catch(() => {
          app.load = false
        })
    },
    setSubjectQuestion(subjectTeacher) {
      const app = this
      app.set_question = false
      app.subject_teacher = subjectTeacher
      app.subject_teacher.class_teacher = app.class_teacher
      app.set_question = true
    },
  },
}
</script>
