<!-- eslint-disable vue/no-v-html -->
<template>
  <el-row :gutter="5">
    <el-col
      v-if="!submitted"
      :xs="24"
      :sm="24"
      :md="16"
      :lg="16"
      :xl="16"
    >
      <el-alert
        v-if="show_offline_badge"
        title="You are currently offline. To be able to SUBMIT, kindly connect to the internet"
        type="error"
        effect="dark"
      />
      <div
        v-loading="loader"
        class="box-body"
      >
        <div v-if="!preview">
          <div
            v-for="(quiz, index) in answers"
            :key="index"
          >
            <div
              v-if="current_question == index"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12 "
              style="padding: 5px; border: 5px double #c0c0c0;border-radius: 8px;"
            >
              <div>
                <strong style="color: red">
                  Question {{ index + 1 }}  of  {{ answers.length }}
                </strong>
              </div>
              <hr>
              <aside>
                <span v-html="quiz.question.question" />
              </aside>
              <div style="padding:10px;">

                <div class="control-group">
                  <label
                    class="control-label"
                    for="inputEmail"
                  />
                  <div class="controls">
                    <input
                      v-model="quiz.question_id"
                      type="hidden"
                    >
                    <div id="opt11">
                      <el-radio

                        v-model="quiz.student_answer"
                        label="A"
                        border
                        size="medium"
                        @change="quiz.student_answer_option = quiz.question.optA"
                      />
                      <span
                        v-html="quiz.question.optA"
                      />
                      <hr>
                      <el-radio
                        v-model="quiz.student_answer"
                        label="B"
                        border
                        size="medium"
                        @change="quiz.student_answer_option = quiz.question.optB"
                      />
                      <span v-html="quiz.question.optB" />
                      <hr>
                      <el-radio
                        v-model="quiz.student_answer"
                        label="C"
                        border
                        size="medium"
                        @change="quiz.student_answer_option = quiz.question.optC"
                      />
                      <span v-html="quiz.question.optC" />
                      <hr>
                      <el-radio
                        v-model="quiz.student_answer"
                        label="D"
                        border
                        size="medium"
                        @change="quiz.student_answer_option = quiz.question.optD"
                      />
                      <span v-html="quiz.question.optD" />
                      <hr>
                      <!-- <label
                        for="ansA"
                        style="cursor: pointer"
                      >(A)&nbsp;&nbsp;</label>
                      <input
                        id="ansA"
                        v-model="quiz.student_answer"
                        :name="'answer'+index"
                        value="A"
                        type="radio"
                        @click="quiz.student_answer_option = quiz.question.optA"
                      > <span v-html="quiz.question.optA" /><br><br>

                      <label
                        for="ansB"
                        style="cursor: pointer"
                      >(B)&nbsp;&nbsp;</label>
                      <input
                        id="ansB"
                        v-model="quiz.student_answer"
                        :name="'answer'+index"
                        value="B"
                        type="radio"
                        @click="quiz.student_answer_option = quiz.question.optB"
                      > <span v-html="quiz.question.optB" /><br><br>

                      <label
                        for="ansC"
                        style="cursor: pointer"
                      >(C)&nbsp;&nbsp;</label>
                      <input
                        id="ansC"
                        v-model="quiz.student_answer"
                        :name="'answer'+index"
                        value="C"
                        type="radio"
                        @click="quiz.student_answer_option = quiz.question.optC"
                      ><span v-html="quiz.question.optC" /><br><br>

                      <label
                        for="ansD"
                        style="cursor: pointer"
                      >(D)&nbsp;&nbsp;</label>
                      <input
                        id="ansD"
                        v-model="quiz.student_answer"
                        :name="'answer'+index"
                        value="D"
                        type="radio"
                        @click="quiz.student_answer_option = quiz.question.optD"
                      ><span v-html="quiz.question.optD" /><br>-->

                    </div>

                  </div>
                </div>
              </div>
              <br>

              <div class="demo-inline-spacing pull-right">
                <button
                  v-if="index != 0"
                  class="btn btn-danger"
                  @click="load(index,index-1);"
                > <feather-icon
                  icon="ArrowLeftIcon"
                /> Prev
                </button>
                <button
                  v-if="index+1 === answers.length"
                  class="btn btn-dark"
                  @click="previewAswers()"
                > <feather-icon
                  icon="ListIcon"
                /> Preview
                </button>
                <button
                  v-else
                  class="btn btn-primary"
                  @click="load(index,index+1);"
                > Next
                  <feather-icon
                    icon="ArrowRightIcon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="preview"
          id="preview"
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          style="height: 350px; overflow:auto; background:#fcfcfc; border: 3px double #E1E1E1;border-radius: 8px; padding: 5px;"
        >
          <legend>Preview of your answers</legend>
          <div
            v-for="(quiz, index) in answers"
            :key="index"
          >
            <h4><font color="green">
              Question {{ index+1 }}:
            </font><strong><span v-html="quiz.question.question" /></strong>You selected: (<font color="red">
              <strong>{{ quiz.student_answer }}</strong>
            </font>)<span v-html="quiz.student_answer_option" /></h4><br>
          </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

          <div
            v-if="preview"
            id="back_to_quest"
            class="demo-inline-spacing"
          >
            <hr>
            <a
              style="cursor:pointer;"
              class="btn btn-warning"
              @click="load(answers.length,answers.length-1);"
            > Back to Question </a>
            <button
              class="btn btn-success"
              @click="saveAnswers()"
            >
              SUBMIT
            </button>

          </div>

        </div>
      </div>

    </el-col>
    <el-col
      v-if="!submitted"
      :xs="24"
      :sm="24"
      :md="8"
      :lg="8"
      :xl="8"
    >

      <div id="clock">

        <stop-watch
          v-if="quiz_attempt != ''"
          :quiz-attempt="quiz_attempt"
          @timeup="checkTime"
        />

      </div>
      <aside>
        <legend>Navigate Questions</legend>

        <a
          v-for="(quiz, index) in answers"
          :id="'quest_button_'+index"
          :key="index"
          style="cursor:pointer; font-size: 20px; border-radius: 4px; background-color: #ccc; color: #fff; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px;"
          @click="change(index);"
        >{{ index+1 }}</a>
        <hr>
        <a
          v-if="!show_calculator"
          style="font-size: 20px;"
          class="badge btn-dark"
          @click="show_calculator=true"
        >Show Calculator</a>
        <a
          v-if="show_calculator"
          class="badge btn-danger"
          style="font-size: 20px;"
          @click="show_calculator=false"
        >Hide Calculator</a>
        <div v-if="show_calculator"><hr>
          <calculator />
        </div>
      </aside>
    </el-col>
    <div
      v-if="submitted"
      class="block col-md-12"
    >
      <div
        class="gradient"
        align="center"
      >
        <div class="title">

          <h1><font color="red">
            <span v-html="score_board_message" /></font></h1>
          <div style="background: #000; color: #ffffff; padding: 30px; ">

            <h3>Score Board </h3>
            <!-- <h2>{{ 'Score: '+submit_response.student_point+'/'+submit_response.limit }}</h2> -->
            <h2>{{ 'Percentage score: '+submit_response.percent_score+'%' }}</h2>
          </div>
          <hr>

        </div>
        <!-- <a ><img :src="exit_logo"/><h3>EXIT</h3></a> -->
      </div>
    </div>
  </el-row>
</template>
<script>
import StopWatch from '../StopWatch.vue'
import Calculator from '../Calculator.vue'

import Resource from '@/api/resource'

export default {
  components: { StopWatch, Calculator },
  props: {
    compiledQuiz: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      quiz_attempt: '',
      show_calculator: false,
      answers: [],
      current_question: 0,
      preview: false,
      timeup: false,
      submitted: false,

      submit_response: '',
      score_board_message: '',
      exit_logo: '/img/exit.png',
      loader: false,
      show_offline_badge: false,
    }
  },
  mounted() {
    setInterval(() => {
      if (!navigator.onLine) {
        this.show_offline_badge = true
      } else {
        this.show_offline_badge = false
      }
    }, 3000)
    this.attemptQuiz()
    // this.change(this.current_question);
  },
  methods: {
    // checkKeyDown() {
    //   const app = this
    //   // ensure arrow keys are bound to prev/next event button////////////////////////
    //   document.onkeydown = function (e) {
    //     e = e || window.event
    //     switch (e.which) {
    //       case 37: // left arrow
    //         if (app.current_question > 0) {
    //           app.load(app.current_question, app.current_question - 1)
    //         }

    //         break

    //       case 39: // right arrow
    //         if (app.current_question + 1 < app.answers.length) {
    //           app.load(app.current_question, app.current_question + 1)
    //         }

    //         break
    //       default:
    //         console.log('no default')
    //     }
    //   }
    //   /// ////////////////////////////////////////
    // },
    load(current, next) {
      this.preview = false
      document.getElementById(`quest_button_${current}`).style.backgroundColor = '#ccc'
      this.current_question = next

      document.getElementById(`quest_button_${next}`).style.backgroundColor = '#606'

      // jQuery('#preview').hide();

      // jQuery('#back_to_quest').hide();

      this.colorButton(current)
    },
    colorButton(current) {
      this.preview = false
      // var count = this.answers.length;
      // for ( var a = 1; a<=count; a++) {

      // var rates = document.getElementsByName('answer'+current);

      // var checked = false;
      // for(var i = 0; i < rates.length; i++){
      //     if(rates[i].checked){
      //         checked = true;
      //     }

      // }
      document.getElementById(`quest_button_${current}`).style.backgroundColor = '#ccc'
      if (this.answers[current].student_answer != null) {
        document.getElementById(`quest_button_${current}`).style.backgroundColor = '#337ab7'
      }
      // }
    },
    change(value) {
      this.preview = false
      const count = this.answers.length

      // jQuery('#q_' + val ).show();
      this.current_question = value
      document.getElementById(`quest_button_${value}`).style.backgroundColor = '#606'
      // eslint-disable-next-line no-plusplus
      for (let a = 0; a < count; a++) {
        if (value !== a) {
          this.colorButton(a)
        }
      }
      // jQuery('#preview').hide();
      // jQuery('#back_to_quest').hide();
    },
    previewAswers() {
      this.preview = true
    },
    attemptQuiz() {
      const app = this
      app.loader = true
      // let formData = new FormData();
      // formData.quiz_compilation_id = app.compiledQuiz.id;
      // formData.remaining_time = app.compiledQuiz.duration;
      const attemptQuizResource = new Resource('lms/attempt-quiz')
      const param = {
        quiz_compilation_id: app.compiledQuiz.id,
        remaining_time: app.compiledQuiz.duration,
      }
      attemptQuizResource.store(param) // back end route from web.php

        .then(response => {
          app.loader = false
          app.quiz_attempt = response.quiz_attempt
          app.answers = response.answers

          if (app.quiz_attempt.remaining_time < 1 || app.quiz_attempt.has_submitted === 'yes') {
            app.timeup = true
            app.submitted = true
            app.score_board_message = `YOU HAVE TAKEN EXAMINATION #${app.compiledQuiz.id} ALREADY`
            app.doSubmit()
          }
          // app.checkKeyDown()
        }).catch(() => {
          app.loader = false
        })
    },
    checkTime() {
      const app = this
      app.timeup = true
      app.submitted = true
      app.score_board_message = 'TIME IS UP!!!<br>EXAMINATION SUBMITTED AUTOMATICALLY'
      app.doSubmit()
    },
    doSubmit() {
      const app = this
      app.loader = true
      const submitQuizResource = new Resource('lms/submit-quiz-answers')
      app.quiz_attempt.remaining_time = 0
      const formData = app.answers
      // console.log(formData)
      submitQuizResource.store(formData) // back end route from web.php

        .then(response => {
          app.submit_response = response
          app.submitted = true
          app.loader = false
        })
    },
    saveAnswers() {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to submit?')) {
        app.score_board_message = 'EXAMINATION SUBMITTED SUCCESSFULLY'
        app.doSubmit()
      }
    },
  },
}
</script>
