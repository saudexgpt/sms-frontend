<template>
  <div class="box">
    <div class="box-body">
      <el-row
        v-if="compiledQuizzes.length > 0"
        :gutter="10"
      >
        <div v-if="!take_quiz">
          <el-col
            v-for="(quiz, index) in compiledQuizzes"
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
              @click="takeQuiz(quiz)"
            >
              <div class="truncate">
                <strong>{{ quiz.subject_teacher.subject.name }}</strong>
                <p>{{ 'Test ID: #' + quiz.id }}</p>
                <p>{{ quiz.question_type.toUpperCase() }}</p>
                <small>Click to take exam</small>
              </div>
            </b-card>
          </el-col>
        </div>

        <div v-if="take_quiz">
          <br>
          <!-- <button
            class="btn btn-info"
            @click="take_quiz=false"
          >Take Another Exam</button> -->

          <take-obj-quiz
            v-if="option == 'take_obj_quiz'"
            :compiled-quiz="compiled_quiz"
          />
          <take-theory-quiz
            v-if="option == 'take_theory_quiz'"
            :compiled-quiz="compiled_quiz"
          />
        </div>
      </el-row>
      <div v-else>
        <div class="callout callout-danger">
          You have no Examination to take.
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import { BCard } from 'bootstrap-vue'
import TakeObjQuiz from './partials/objective/TakeQuiz.vue'
import TakeTheoryQuiz from './partials/theory/TakeQuiz.vue'

export default {
  components: { BCard, TakeObjQuiz, TakeTheoryQuiz },
  props: {
    compiledQuizzes: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      compiled_quiz: '',
      take_quiz: false,
      option: '',
    }
  },
  mounted() {
    // this.fetchData()
  },
  methods: {
    takeQuiz(compiledQuiz) {
      const app = this
      app.compiled_quiz = compiledQuiz
      app.take_quiz = true
      if (compiledQuiz.question_type === 'theory') {
        app.option = 'take_theory_quiz'
      } else {
        app.option = 'take_obj_quiz'
      }
    },
    // fetchData() {
    //   const app = this
    //   axios.get('/lms/quiz-dashboard') // back end route from web.php

    //     .then(response => {
    //       app.compiled_quizzes = response.data.compiled_quizzes
    //     })
    // },
  },
}
</script>
