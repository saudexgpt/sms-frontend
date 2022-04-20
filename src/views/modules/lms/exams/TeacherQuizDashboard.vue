<template>
  <div v-if="can_view_teacher">
    <el-row
      :gutter="8"
    >
      <el-col
        :xs="24"
        :sm="8"
        :md="8"
      >
        <router-link
          to="set-questions"
          class="small-box-footer"
        >
          <statistic-card-horizontal
            color="white"
            bg="primary"
            icon="ListIcon"
            :statistic="teacher_questions"
            statistic-title="Question Bank"
          />
        </router-link>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
      >
        <statistic-card-horizontal
          color="white"
          bg="warning"
          icon="Edit2Icon"
          :statistic="compiled_quizzes"
          statistic-title="Quizzes"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
      >
        <statistic-card-horizontal
          color="white"
          bg="success"
          icon="UserCheckIcon"
          :statistic="quiz_attempts"
          statistic-title="Attempts"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import Resource from '@/api/resource'

const studentDashboard = new Resource('lms/quiz-dashboard')
export default {
  components: {
    StatisticCardHorizontal,
  },
  data() {
    return {
      teacher_questions: 0,
      compiled_quizzes: 0,
      quiz_attempts: 0,
      can_view_teacher: false,

    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const app = this
      studentDashboard.list() // back end route from web.php

        .then(response => {
          app.teacher_questions = response.teacher_questions
          app.compiled_quizzes = response.compiled_quizzes
          app.quiz_attempts = response.quiz_attempts
          app.teacher_questions = response.teacher_questions
          app.can_view_teacher = response.can_view_teacher
        })
    },
  },
}
</script>
