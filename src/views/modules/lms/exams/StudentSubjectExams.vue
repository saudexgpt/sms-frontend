<template>
  <div v-loading="load">
    <el-row
      v-if="page==='subject_list'"
      :gutter="10"
    >
      <div
        class="demo-inline-spacing"
      ><h3>Subjects with active exams</h3>
        <button
          class="btn btn-success"
          @click="fetchSubjectQuizzes()"
        >
          <feather-icon
            icon="RefreshCwIcon"
          /> Reload
        </button>
      </div>
      <br>
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
          @click="showExamList(subject_teacher.quiz_compilations)"
        >
          <b-avatar
            class="mb-1"
            :variant="randomColor()"
            size="45"
          >
            <feather-icon
              size="21"
              icon="BookOpenIcon"
            />
          </b-avatar>
          <div class="truncate">
            <h2 class="mb-25 font-weight-bolder">
              {{ subject_teacher.quiz_compilations.length }}
            </h2>
            <span>{{ subject_teacher.subject.code }}</span>
          </div>
        </b-card>
      </el-col>
    </el-row>
    <div v-if="page === 'view_quiz'">
      <el-row>
        <b-button
          variant="danger"
          @click="page='subject_list'"
        >
          Back to Subjects
        </b-button>
      </el-row>
      <br>
      <student-compiles-quizzes :compiled-quizzes="select_quiz_compilations" />
    </div>
  </div>
</template>
<script>
import { BCard, BAvatar, BButton } from 'bootstrap-vue'
import Resource from '@/api/resource'
import StudentCompilesQuizzes from './StudentCompilesQuizzes.vue'

const studentQuizResource = new Resource('lms/student-quizzes')

export default {
  components: {
    BCard,
    BAvatar,
    BButton,
    StudentCompilesQuizzes,
  },
  data() {
    return {
      subject_teachers: [],
      load: false,
      select_quiz_compilations: [],
      page: 'subject_list',
    }
  },
  created() {
    this.fetchSubjectQuizzes()
  },
  methods: {
    showExamList(quizCompilations) {
      this.select_quiz_compilations = quizCompilations
      this.page = 'view_quiz'
    },
    fetchSubjectQuizzes() {
      const app = this
      app.load = true
      studentQuizResource.list()
        .then(response => {
          app.subject_teachers = response.subject_teachers
          app.load = false
        })
    },
    randomColor() {
      const randomArray = ['primary', 'success', 'warning', 'dark', 'danger']
      return randomArray[Math.floor((Math.random() * randomArray.length))]
    },
  },
}
</script>
