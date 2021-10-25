<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div
      v-if="!view_students_responses"
      class="box"
    >
      <div class="box-header">
        <a
          class="btn btn-info"
          @click="compiled_exam = true; new_compilation=false; edit_compilation=false"
        >Compiled Exam</a>
        <a
          class="btn btn-success"
          @click="compiled_exam = false; new_compilation=true; edit_compilation=false; form=empty_form;"
        >New Compilation</a>

      </div>
      <div class="box-body">
        <div v-if="compiled_exam">
          <div v-if="subject_teacher.quiz_compilations.length < 1">
            <div class="callout callout-danger">
              No quiz is compiled for {{ subject_teacher.subject.name }}
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
                  <strong class="red">{{ compiled_quiz.question_type.toUpperCase() }} EXAM ID: {{ compiled_quiz.id }}</strong><br>
                  <strong class="">{{ compiled_quiz.quizzes.length }} Questions Compiled</strong>
                </p>

                <p>
                  <a @click="editCompilation(index,compiled_quiz)"><i class="fa fa-edit" /> Edit</a> |
                  <a @click="deleteCompiledQuiz(compiled_quiz, index)"><i class="fa fa-trash" /> Delete</a>
                </p>

                <div v-if="compiled_quiz.status == 'Inactive'">
                  <a
                    class="btn btn-success btn-sm"
                    @click="activateQuiz(compiled_quiz, 'Active')"
                  >Activate</a>
                </div>
                <div v-if="compiled_quiz.status == 'Active'">
                  <a
                    class="btn btn-danger btn-sm"
                    @click="activateQuiz(compiled_quiz, 'Inactive')"
                  >Deactivate</a>
                </div>
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
          <div class="col-md-8">
            <div class="box primary">
              <div class="box-header bg-blue">
                <h4 class="box-title">
                  Select questions for quiz
                </h4>

              </div>
              <div class="box-body">
                <v-client-table
                  :data="subject_teacher.questions"
                  :columns="columns"
                  :options="options"
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
                    slot="select"
                    slot-scope="props"
                  >
                    <div class="table__actions">

                      <input
                        v-model="form.question_ids"
                        type="checkbox"
                        :value="props.row.id"
                      >

                    </div>
                  </template>

                </v-client-table>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="box primary">
              <div class="box-header bg-blue">
                <h4 class="box-title">
                  Compilation Form
                </h4>
              </div>
              <div class="box-body">
                <form @submit.prevent="saveQuiz()">
                  <div class="col-md-12">
                    <label for="">Selected Questions</label>
                    <input
                      v-model="form.question_ids"
                      type="text"
                      disabled
                      class="form-control"
                    >
                  </div>
                  <div class="col-md-12">
                    <label for="">Brief instruction</label>
                    <input
                      v-model="form.instructions"
                      type="text"
                      placeholder="Give brief instruction"
                      class="form-control"
                    >
                  </div>
                  <div class="col-md-12">
                    <label for="">Quiz duration in seconds [Remember 60secs = 1min]</label>
                    <input
                      v-model="form.duration"
                      type="number"
                      class="form-control"
                    >
                  </div>
                  <div class="col-md-12">
                    <label for="">Points to be acquired</label>
                    <select
                      v-model="form.point"
                      class="form-control"
                    >
                      <option
                        v-for="(point, index) in points"
                        :key="index"
                        :value="point"
                      >
                        {{ point }}
                      </option>
                    </select>

                  </div>
                  <div class="col-md-12">
                    <label for="">Status [Students can access if active]</label>
                    <select
                      v-model="form.status"
                      class="form-control"
                    >
                      <option value="Inactive">
                        Inactive
                      </option>
                      <option value="Active">
                        Active
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <p />
                    <button
                      v-if="edit_compilation"
                      type="submit"
                      class="btn btn-success"
                    >
                      <i class="fa fa-save" /> Update
                    </button>
                    <button
                      v-else
                      type="submit"
                      class="btn btn-success"
                    >
                      <i class="fa fa-save" /> Compile
                    </button>

                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-if="view_students_responses">
      <div v-if="quiz_attempts.length > 0">
        <div class="box-body">
          <label>Note: This test is graded over {{ quiz_attempts[0].score_limit }}</label>
          <legend class="red">
            To record this test, select an assessment and click on <code>Record Score</code>
          </legend>
          <div class="col-xs-9">
            <select
              v-model="record_score.assessment"
              class="form-control"
            >
              <option value="">
                Select Assessment
              </option>
              <option
                v-for="(assessment, index) in assessments"
                :key="index"
                :value="assessment.value"
              >
                {{ assessment.label }}
              </option>
            </select>
          </div>
          <div class="col-xs-3">
            <a
              class="btn btn-success"
              @click="recordScore()"
            >Record Score</a>
          </div>

        </div>
        <students-responses :quiz_attempts="quiz_attempts" />
      </div>

    </div>
  </div>
</template>
<script>
import StudentsResponses from './StudentsResponses.vue'
import Resource from '@/api/resource'

export default {
  components: { StudentsResponses },
  props: {
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      assessments: [
        { value: 'mid_term', label: 'Mid Term' },
        { value: 'ca1', label: 'First C.A' },
        { value: 'ca2', label: 'Second C.A' },
        { value: 'ca3', label: 'Third C.A' },
        { value: 'exam', label: 'Examination' },

      ],
      view_students_responses: false,
      quiz_attempts: [],
      points: [10, 20, 30, 50, 60, 70, 100],
      columns: ['select', 'question', 'optA', 'optB', 'optC', 'optD', 'answer'],
      options: {
        headings: {
          question: 'Question',
          optA: 'Opt A',
          optB: 'Opt B',
          optC: 'Opt C',
          optD: 'Opt D',
          optE: 'Opt E',
          answer: 'Answer',
          point: 'Point',
          select: 'Select',
        },
        sortable: [],
        filterable: ['question'],
      },
      form: {
        subject_teacher_id: this.subject_teacher.id,
        instructions: '',
        duration: 60,
        point: 30,
        status: 'Inactive',
        question_ids: [],
        question_type: 'objective',

      },
      empty_form: {
        subject_teacher_id: this.subject_teacher.id,
        instructions: '',
        duration: 60,
        point: 30,
        status: 'Inactive',
        question_ids: [],
        question_type: 'objective',
      },
      record_score: {
        assessment: '',
        quiz_attempts: [],

      },
      error: false,
      edit_compilation: false,
      compiled_exam: true,
      new_compilation: false,
      edit_quiz_index: '',

    }
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
      const deleteQuizResource = new Resource('lms/attempt-quiz')
      // eslint-disable-next-line no-alert
      if (window.confirm(alert)) {
        const l = app.$message.loading({
          message: 'deleting...',
          align: 'center',
        })
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
        const activateQuizResource = new Resource('lms/activate-quiz')
        const formData = compiledQuiz
        formData.status = status
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
        updateQuizResource.put(formData.id, formData) // back end route from web.php

          .then(response => {
            l.close()
            app.subject_teacher.quiz_compilations.splice(app.edit_quiz_index, 1)
            app.subject_teacher.quiz_compilations.push(response.data.compilation)
            // app.form = app.empty_form
            app.notifyMe('Quiz Updated', 'Successful', 'success')
          })
      } else {
        const setQuizResource = new Resource('lms/set-quiz')
        setQuizResource.post(formData) // back end route from web.php
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
      app.compiledQuiz = compiledQuiz
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
    // recordScore() {
    //   const app = this
    //   const param = app.record_score
    //   param.quiz_attempts = app.quiz_attempts
    //   const l = this.$message.loading({
    //     message: 'recording score...',
    //     align: 'center',

    //   })

    //   axios.post('/result/record-cbt-score', param) // back end route from web.php
    //     .then(response => {
    //       l.close()
    //       app.notifyMe('Score Recorded', 'Successful', 'success')
    //     })
    // },
  },
}
</script>
