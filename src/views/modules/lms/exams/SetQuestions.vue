<template>
  <div v-loading="load">
    <div v-if="!select_question_type">
      <el-row
        v-if="!select_question_type"
        :gutter="10"
      >
        <el-col
          v-for="(subject_teacher, index) in subject_teachers"
          :key="index"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          :xl="2"
        >
          <b-card
            class="text-center"
            style="cursor: pointer"
            :style="'cursor: pointer; color: #ffffff; background: ' + subject_teacher.subject.color_code"
            @click="setSubjectQuestion(subject_teacher)"
          >
            <div class="truncate">
              <strong>{{ subject_teacher.subject.code.toUpperCase() }}</strong>
              <p>{{ subject_teacher.class_teacher.c_class.name }}</p>
            </div>
          </b-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="select_question_type">
      <span>
        <el-button
          @click="select_question_type=false"
        >
          Subject List
        </el-button>
      </span>
      <hr>
      <select-question-type :subject-teacher="selected_subject_teacher" />
    </div>
  </div>
</template>
<script>
import { BCard } from 'bootstrap-vue'
import Resource from '@/api/resource'
import SelectQuestionType from './SelectQuestionType.vue'

const subjectTeacherDashboard = new Resource('lms/subject-teachers')
export default {
  components: { BCard, SelectQuestionType },
  data() {
    return {
      subject_teachers: [],
      selected_subject_teacher: {},
      select_question_type: false,
      load: false,
    }
  },
  created() {
    this.subjectTeachers()
    //  var timeinterval = setInterval(() => {
    //     this.subjectTeachers();
    // }, 5000)
  },
  methods: {
    subjectTeachers() {
      const app = this
      app.load = true
      subjectTeacherDashboard.list() // back end route from web.php

        .then(response => {
          app.subject_teachers = response.subject_teachers
          app.load = false
        })
    },
    setSubjectQuestion(subjectTeacher) {
      const app = this
      app.select_question_type = false
      app.selected_subject_teacher = subjectTeacher
      app.select_question_type = true
    },
  },
}
</script>
