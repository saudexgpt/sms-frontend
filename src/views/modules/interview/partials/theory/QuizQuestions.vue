<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="box">

    <div
      v-if="!submitted"
      class="block col-md-8"
    >

      <div class="box-body">
        <form @submit.prevent="saveAnswers()">

          <div class="col-lg-6 col-md-6">
            <a
              v-if="!preview"
              style="cursor:pointer;"
              class="btn btn-default"
              @click="previewAswers()"
            ><i class="fa fa-list" /> Preview</a>
            <a
              v-if="preview"
              style="cursor:pointer;"
              class="btn btn-warning"
              @click="load(answers.length,answers.length-1);"
            ><i class="fa fa-arrow-left" /> Go Back </a>
            <button
              type="submit"
              class="btn btn-danger"
            >
              <i class="fa fa-save" /> SUBMIT
            </button>

          </div>
          <div
            id="clock"
            class="col-lg-6 col-md-6"
          >

            <stop-watch
              v-if="quiz_attempt != ''"
              :quiz_attempt="quiz_attempt"
              @timeup="checkTime"
            />

          </div>

          <div v-if="!preview">
            <div
              v-for="(quiz, index) in answers"
              :key="index"
            >
              <div
                v-if="current_question == index"
                class="col-lg-12 col-md-12 col-sm-12 col-xs-12 "
                style="padding: 5px; border: 3px double #E1E1E1;border-radius: 8px;"
              >
                <font color="red">
                  Question {{ index + 1 }}  of  {{ answers.length }}
                </font>
                <div style="background: #fcfcfc; padding:10px;">
                  <div
                    class="controls"
                    style="font-size: 15px;"
                  >
                    <span v-html="quiz.theory_question.question" /><hr>
                  </div>

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
                        <label
                          for="ansA"
                          style="cursor: pointer"
                        >Supply your answer here</label>
                        <!-- <vue-editor v-model="quiz.student_answer" :customModules="customModulesForEditor" :editorOptions="editorSettings" placeholder="Type your question here..."></vue-editor> -->

                        <ckeditor
                          v-model="quiz.student_answer"
                          :editor="editor"
                          :config="editorConfig"
                        />

                      </div>

                    </div>
                  </div>
                </div>
                <br><br>

                <div
                  v-if="index != 0"
                  class="pull-left"
                >
                  <a
                    style="cursor:pointer;"
                    class="btn btn-info"
                    @click="load(index,index-1);"
                  ><i class="fa fa-arrow-left" /> Prev</a>
                </div>

                <div
                  v-if="index+1 == answers.length"
                  class="pull-right"
                >
                  <a
                    style="cursor:pointer;"
                    class="btn btn-default"
                    @click="previewAswers()"
                  ><i class="fa fa-list" /> Preview</a>
                </div>

                <div
                  v-else
                  class="pull-right"
                >
                  <a
                    style="cursor:pointer;"
                    class="btn btn-info"
                    @click="load(index,index+1);"
                  >Next <i class="fa fa-arrow-right" /></a>&nbsp;&nbsp;&nbsp;

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
              </font><strong><span v-html="quiz.theory_question.question" /></strong>
                Your answer: <span v-html="quiz.student_answer" /></h4><br>
            </div>
          </div>

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

            <div
              v-if="preview"
              id="back_to_quest"
            >
              <hr>
              <a
                style="cursor:pointer;"
                class="btn btn-warning"
                @click="load(answers.length,answers.length-1);"
              ><i class="fa fa-arrow-left" /> Go Back </a>
              <button
                type="submit"
                class="btn btn-danger"
              >
                <i class="fa fa-save" /> SUBMIT
              </button>

            </div>

            <legend>Navigate Questions</legend>

            <a
              v-for="(quiz, index) in answers"
              :id="'quest_button_'+index"
              :key="index"
              style="cursor:pointer; font-size: 20px; border-radius: 4px; background-color: #ccc; color: #fff; padding-left: 10px; padding-right: 10px; padding-top: 5px; padding-bottom: 5px;"
              @click="change(index);"
            >{{ index+1 }}</a>

          </div>

        </form>
      </div>

    </div>
    <div
      v-if="!submitted"
      class="col-lg-4 col-md-4"
    >
      <a
        v-if="!show_calculator"
        style="font-size: 20px;"
        class="badge btn-success"
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
    </div>
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
          <div style="background-color: #000; color: #fff; padding: 30px; ">

            <h3>Score Board </h3>
            <!-- <h2>{{'Score: '+submit_response.student_point}}</h2>
                        <h2>{{'Percentage score: '+submit_response.percent_score+'%'}}</h2> -->
            <p>Your teacher will assess and grade you</p>
          </div>
          <hr>

        </div>
        <!-- <a ><img :src="exit_logo"/><h3>EXIT</h3></a> -->
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from 'ckeditor4-vue'
import StopWatch from '../StopWatch.vue'
import Calculator from '../Calculator.vue'

import Resource from '@/api/resource'
// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-vue'//'quill-image-resize-module'

// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
export default {
  components: { StopWatch, Calculator, ckeditor: CKEditor.component },
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
      // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
      // editorSettings: {
      //     modules: {
      //     imageDrop: true,
      //     imageResize: {}
      //     }
      // },
      editor: '',
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  mounted() {
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

      // let formData = new FormData();
      // formData.quiz_compilation_id = app.compliedQuiz.id;
      // formData.remaining_time = app.compliedQuiz.duration;
      const attemptQuizResource = new Resource('lms/attempt-quiz')
      const param = {
        quiz_compilation_id: app.compliedQuiz.id,
        remaining_time: app.compliedQuiz.duration,
      }
      attemptQuizResource.store(param) // back end route from web.php

        .then(response => {
          app.quiz_attempt = response.quiz_attempt
          app.answers = response.answers

          if (app.quiz_attempt.remaining_time < 1 || app.quiz_attempt.has_submitted === 'yes') {
            app.timeup = true
            app.submitted = true
            app.score_board_message = 'YOU HAVE TAKEN THIS EXAMINATION ALREADY'
            app.doSubmit()
          }
          // app.checkKeyDown()
        })
    },
    // attemptQuiz() {
    //   const app = this

    //   // let formData = new FormData();
    //   // formData.quiz_compilation_id = app.compiled_quiz.id;
    //   // formData.remaining_time = app.compiled_quiz.duration;
    //   const param = `?quiz_compilation_id=${app.compiled_quiz.id}&remaining_time=${app.compiled_quiz.duration}`
    //   axios.post(`/lms/attempt-quiz${param}`) // back end route from web.php

    //     .then(response => {
    //       app.quiz_attempt = response.data.quiz_attempt
    //       app.answers = response.data.answers

    //       if (app.quiz_attempt.remaining_time < 1 || app.quiz_attempt.has_submitted == 'yes') {
    //         app.timeup = true
    //         app.score_board_message = 'YOU HAVE TAKEN THIS EXAMINATION ALREADY'
    //         app.submitted = true
    //         app.submit_response = app.quiz_attempt
    //       }
    //       app.checkKeyDown()
    //     })
    // },
    checkTime() {
      const app = this
      app.timeup = true
      app.submitted = true
      app.score_board_message = 'TIME IS UP!!!<br>EXAMINATION SUBMITTED AUTOMATICALLY'
      app.doSubmit()
    },
    doSubmit() {
      const app = this
      const submitQuizResource = new Resource('lms/submit-quiz-answers')
      app.quiz_attempt.remaining_time = 0
      const formData = app.answers
      submitQuizResource.store('/lms/submit-quiz-answers', formData) // back end route from web.php

        .then(response => {
          app.submit_response = response
          app.submitted = true
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
