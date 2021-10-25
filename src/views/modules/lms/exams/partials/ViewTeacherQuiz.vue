<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div
      v-if="!view_students_responses"
      class="box"
    >
      <div class="box-header">
        <h4 class="box-title">
          Examination for {{ subject_teacher.subject.name }}
        </h4>
      </div>
      <div class="box-body">
        <div v-if="compiled_exam">
          <div v-if="subject_teacher.quiz_compilations.length < 1">
            <div class="callout callout-danger">
              No examination is compiled for {{ subject_teacher.subject.name }}
            </div>
          </div>
          <div v-else>
            <div
              v-for="(compiled_quiz, index) in subject_teacher.quiz_compilations"
              :key="index"
              class="col-md-3 col-sm-4 col-xs-6"
            >
              <div class="div-square">
                <i class="fa fa-folder fa-3x" />
                <p>
                  <strong class="red">EXAM ID: {{ compiled_quiz.id }}</strong><br>
                  <strong class="">{{ compiled_quiz.quizzes.length }} Questions Compiled</strong>
                </p>
                <p>{{ compiled_quiz.question_type.toUpperCase() }}</p>
                <p>
                  <a
                    class="btn btn-success btn-sm"
                    @click="editCompilation(index,compiled_quiz)"
                  ><i class="fa fa-eye" /> View Details</a>

                </p>

                <p>
                  <a
                    class="btn btn-primary"
                    @click="viewResponses(compiled_quiz)"
                  ><i class="fa fa-users" /> Students' Responses</a>

                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- /.tab-pane -->
        <div
          v-if="new_compilation || edit_compilation"
          class="tab-pane"
        >
          <div class="col-md-12">
            <a
              class="btn btn-danger"
              @click="compiled_exam = true; new_compilation=false; edit_compilation=false"
            >Go back</a>
          </div>
          <div class="col-md-8">
            <div class="box primary">
              <div class="box-header bg-blue">
                <h4 class="box-title">
                  Examination Questions
                </h4>

              </div>
              <div class="box-body">
                <div class="box-body">
                  <v-client-table
                    v-if="detail_option == 'theory'"
                    :data="subject_teacher.theory_questions"
                    :columns="columnsTheory"
                    :options="optionsTheory"
                  >

                    <template
                      slot="question"
                      slot-scope="props"
                    >
                      <span v-html="props.row.question" />
                    </template>

                    <template
                      slot="sn"
                      slot-scope="props"
                    >
                      {{ props.index }}
                    </template>

                  </v-client-table>
                </div>
                <v-client-table
                  v-if="detail_option == 'objective'"
                  :data="subject_teacher.questions"
                  :columns="columnsObj"
                  :options="optionsObj"
                >

                  <template
                    slot="question"
                    slot-scope="props"
                  >
                    <span v-html="props.row.question" />
                  </template>
                  <template
                    slot="optA"
                    slot-scope="props"
                  >
                    <span v-html="props.row.optA" />
                  </template>
                  <template
                    slot="optB"
                    slot-scope="props"
                  >
                    <span v-html="props.row.optB" />
                  </template>
                  <template
                    slot="optC"
                    slot-scope="props"
                  >
                    <span v-html="props.row.optC" />
                  </template>
                  <template
                    slot="optD"
                    slot-scope="props"
                  >
                    <span v-html="props.row.optD" />
                  </template>
                  <template
                    slot="answer"
                    slot-scope="props"
                  >
                    <span v-html="props.row.answer" />
                  </template>

                  <template
                    slot="sn"
                    slot-scope="props"
                  >
                    {{ props.index }}
                  </template>

                </v-client-table>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="box primary">
              <div class="box-header bg-blue">
                <h4 class="box-title">
                  Examination Details
                </h4>
              </div>
              <div class="box-body">
                <form @submit.prevent="saveQuiz()">

                  <div class="col-md-12">
                    <p for="">
                      Brief instruction
                    </p>
                    <label>{{ form.instructions }}</label>
                  </div>
                  <div class="col-md-12">
                    <p for="">
                      Examination duration in seconds [Remember 60secs = 1min]
                    </p>
                    <label>{{ form.duration }}</label>

                  </div>
                  <div class="col-md-12">
                    <p for="">
                      Points to be acquired
                    </p>
                    <label>{{ form.point }}</label>

                  </div>
                  <div class="col-md-12">
                    <p for="">
                      Status
                    </p>
                    <label>{{ form.status }}</label>

                  </div>

                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-if="view_students_responses">
      <a
        class="btn btn-danger"
        @click="view_students_responses = false"
      >Go Back</a>
      <obj-students-responses
        v-if="option=='objective'"
        :quiz_attempts="quiz_attempts"
      />
      <theory-students-responses
        v-if="option=='theory'"
        :quiz_attempts="quiz_attempts"
      />
    </div>

  </div>
</template>
<script>
import ObjStudentsResponses from './objective/StudentsResponses.vue'
import TheoryStudentsResponses from './theory/StudentsResponses.vue'
import Resource from '@/api/resource'

export default {
  components: { ObjStudentsResponses, TheoryStudentsResponses },
  props: {
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      view_students_responses: false,
      quiz_attempts: [],
      points: [10, 20, 30, 50, 60, 70, 100],
      columnsTheory: ['sn', 'question'],
      optionsTheory: {
        headings: {
          question: 'Question',

          sn: 'S/N',
        },
        sortable: [],
        filterable: ['question'],
      },
      columnsObj: ['sn', 'question', 'optA', 'optB', 'optC', 'optD', 'answer'],
      optionsObj: {
        headings: {
          question: 'Question',
          optA: 'Opt A',
          optB: 'Opt B',
          optC: 'Opt C',
          optD: 'Opt D',
          optE: 'Opt E',
          answer: 'Answer',
          point: 'Point',
          sn: 'S/N',
        },
        sortable: [],
        filterable: ['question'],
      },
      form: {
        subject_teacher_id: this.subjectTeacher.id,
        instructions: '',
        duration: 60,
        point: 30,
        status: 'Inactive',
        question_ids: [],

      },
      empty_form: {
        subject_teacher_id: this.subjectTeacher.id,
        instructions: '',
        duration: 60,
        point: 30,
        status: 'Inactive',
        question_ids: [],
      },
      error: false,
      edit_compilation: false,
      compiled_exam: true,
      new_compilation: false,
      edit_quiz_index: '',
      option: '',
      detail_option: '',
      subject_teacher: '',

    }
  },
  created() {
    this.subject_teacher = this.subjectTeacher
  },
  methods: {
    notifyMe(message, title, type) {
      if (type === 'success') {
        this.$toast.success({
          title,
          message,
        })
      } else if (type === 'warning') {
        this.$toast.warning({
          title,
          message,
        })
      } else {
        this.$toast.error({
          title,
          message,
        })
      }
    },
    deleteCompiledQuiz(compiledQuiz, index) {
      const app = this
      const alert = 'Confirm Delete Action! This cannot be undone'
      // eslint-disable-next-line no-alert
      if (window.confirm(alert)) {
        const l = app.$message.loading({
          message: 'deleting...',
          align: 'center',
        })

        const deleteQuizResource = new Resource('lms/delete-quiz')
        const formData = compiledQuiz
        deleteQuizResource.destroy(formData.id, formData) // back end route from web.php

          .then(() => {
            l.close()
            app.subject_teacher.quiz_compilations.splice(index, 1)
            // app.subject_teacher.quiz_compilations.push(response.data.quiz_compilations);
            // app.subject_teacher.quiz_compilations = response.data.quiz_compilations;
          })
      }
    },
    activateQuiz(compiledQuiz, status) {
      const app = this
      const message = 'Confirm Action'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const l = app.$message.loading({
          message: 'loading...',
          align: 'center',
        })
        const formData = compiledQuiz
        formData.status = status
        const activateQuizResource = new Resource('lms/activate-quiz')
        activateQuizResource.update(formData.id, formData) // back end route from web.php

          .then(() => {
            l.close()
            // app.subject_teacher.quiz_compilations.push(response.data.quiz_compilations);
            // app.subject_teacher.quiz_compilations = response.data.quiz_compilations;
          })
      }
    },
    editCompilation(index, compiledQuiz) {
      const app = this
      const questionIds = []
      compiledQuiz.quizzes.forEach(element => {
        questionIds.push(element.question_id)
      })
      app.form.id = compiledQuiz.id
      app.form.subject_teacher_id = compiledQuiz.subject_teacher_id
      app.form.instructions = compiledQuiz.instructions
      app.form.duration = compiledQuiz.duration
      app.form.point = compiledQuiz.point
      app.form.status = compiledQuiz.status
      app.form.question_ids = questionIds

      app.edit_compilation = true
      app.compiled_exam = false
      app.edit_quiz_index = index
      app.detail_option = compiledQuiz.question_type
    },
    saveQuiz() {
      const app = this
      app.error = false
      // app.handleCenterLoading();
      const checkEmptyFields = app.form.question_ids.length === 0 || app.form.instructions === ''

      if (checkEmptyFields === true) {
        app.error = true

        return
      }
      const l = app.$message.loading({
        message: 'loading...',
        align: 'center',
      })
      const formData = app.form

      if (app.edit_compilation) {
        const updateQuizResource = new Resource('lms/update-quiz')
        updateQuizResource.update(formData.id, formData) // back end route from web.php

          .then(response => {
            l.close()
            app.subject_teacher.quiz_compilations.splice(app.edit_quiz_index, 1)
            app.subject_teacher.quiz_compilations.push(response.data.compilation)
            // app.form = app.empty_form
            app.notifyMe('Quiz Updated', 'Successful', 'success')
          })
      } else {
        const setQuizResource = new Resource('lms/set-quiz')
        setQuizResource.store('/lms/set-quiz', formData) // back end route from web.php
          .then(response => {
            l.close()
            app.subject_teacher.quiz_compilations.push(response.data.compilation)
            // app.subject_teacher.quiz_compilations = response.data.quiz_compilations;
            app.form = app.empty_form
            app.notifyMe('Quiz Compiled', 'Successful', 'success')
          })
      }
    },
    viewResponses(compiledQuiz) {
      const app = this
      app.handleCenterLoading()
      app.view_students_responses = true
      app.quiz_attempts = compiledQuiz.quiz_attempts
      app.option = compiledQuiz.question_type
    },
    handleCenterLoading() {
      const l = this.$message.loading({
        message: 'loading...',
        align: 'center',

      })
      setTimeout(() => {
        l.close()
      }, 500)
    },
  },
}
</script>
