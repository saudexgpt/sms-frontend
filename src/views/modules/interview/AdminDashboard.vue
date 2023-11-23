<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card v-loading="load">
    <div
      v-if="add_question && !set_quiz"
      class="box"
    >

      <div slot="header">
        <span
          v-if="button_type === 'new'"
        >
          Add questions to question bank
        </span>
        <span
          v-if="button_type === 'edit'"
        >
          Edit questions
        </span>
        <span class="pull-right">
          <el-button
            class="btn btn-warning"
            size="small"
            @click="add_question=false; form = empty_form;"
          >View Question Bank</el-button>
        </span>
      </div>
      <hr>
      <div>
        <div class="col-md-12">
          <h4>Question</h4>
          <!-- <vue-editor v-model="form.question" :customModules="customModulesForEditor" :editorOptions="editorSettings" placeholder="Type your question here..."></vue-editor> -->
          <ckeditor
            id="question"
            v-model="form.question"
            :editor="editor"
            :config="editorConfig"
          />
        </div>
        <div class="col-md-12">
          <hr>
          <el-alert
            type="error"
            effect="dark"
            :closable="false"
          >
            For the question above, set answer options below. One of them must be correct. When done, click the correct option to aid automatic grading.
          </el-alert>
          <hr>
        </div>
        <el-row :gutter="10">
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <label for="optionA"><h4>Option A <input
              id="optionA"
              v-model="form.answer"
              type="radio"
              value="A"
            ></h4></label>
            <ckeditor
              id="optA"
              v-model="form.optA"
              :editor="editor"
              placeholder="Type Option A here..."
              :config="editorConfig"
            />
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <label for="optionB"><h4>Option B <input
              id="optionB"
              v-model="form.answer"
              type="radio"
              value="B"
            ></h4></label>
            <ckeditor
              id="optB"
              v-model="form.optB"
              :editor="editor"
              placeholder="Type Option B here..."
              :config="editorConfig"
            />
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <label for="optionC"><h4>Option C <input
              id="optionC"
              v-model="form.answer"
              type="radio"
              value="C"
            ></h4></label>
            <ckeditor
              id="optC"
              v-model="form.optC"
              :editor="editor"
              placeholder="Type Option C here..."
              :config="editorConfig"
            />
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <label for="optionD"><h4>Option D <input
              id="optionD"
              v-model="form.answer"
              type="radio"
              value="D"
            ></h4></label>
            <ckeditor
              id="optD"
              v-model="form.optD"
              :editor="editor"
              placeholder="Type Option D here..."
              :config="editorConfig"
            />
          </el-col>
        </el-row>
        <p />
        <div v-if="button_type == 'new'">
          <button
            class="btn btn-success btn-lg"
            @click="saveForm()"
          >
            <i class="fa fa-save" /> Save Question
          </button>
        </div>
        <div v-if="button_type == 'edit'">
          <button
            class="btn btn-primary btn-lg"
            @click="saveForm()"
          >
            <i class="fa fa-edit" /> Update Question
          </button>
        </div>
      </div>
      <span
        v-if="error"
        class="label label-danger"
      >Kindly fill all empty fields and choose the correct option</span>
    </div>
    <div
      v-if="!add_question && !set_quiz"
      class="box"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>Question Bank</span>
        <span style="float: right; padding: 3px 0">
          <el-button
            type="warning"
            size="small"
            @click="add_question=true; $emit('display', false)"
          ><i class="el-icon-plus" /> Add Question</el-button>
          <el-button
            type="primary"
            size="small"
            @click="set_quiz=true; $emit('display', false)"
          ><i class="el-icon-s-order" /> Set Exam</el-button>
          <!-- <el-button
            type="danger"
            size="small"
            @click="option.question_type= 'select'"
          ><i class="el-icon-back" /> Back</el-button> -->
        </span>
      </div>
      <div class="box-body">
        <v-client-table
          :data="questions"
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
            slot="action"
            slot-scope="props"
          >
            <div class="table__actions">

              <el-button
                class="btn btn-primary"
                @click="editQuestion(props.index, props.row); $emit('display', false)"
              ><i class="fa fa-edit" /> Edit</el-button>

            </div>
          </template>

        </v-client-table>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="fetchQuestionBank"
      />
    </div>
    <div
      v-if="set_quiz"
      class="box"
    >
      <div slot="header">
        <span class="pull-right">
          <el-button
            id="view_question_bank"
            @click="add_question=false; set_quiz=false; $emit('display', true)"
          > View Question Bank</el-button>
        </span>
        <h4 class="box-title">
          Set Interview Examination
        </h4>
        <hr>
      </div>
      <div class="box-body">
        <set-quiz
          :questions="questions"
          @reload="$emit('reload')"
        />
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchQuestionBank"
        />
      </div>

    </div>
  </el-card>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import SetQuiz from './partials/objective/SetQuiz.vue'
import Resource from '@/api/resource'
import Pagination from '@/views/components/Pagination-main/index.vue'

export default {
  components: {
    /* VueEditor, */SetQuiz, Pagination,
  },
  data() {
    return {
      set_quiz: false,
      add_question: false,
      questions: [],
      columns: ['action', 'question', 'optA', 'optB', 'optC', 'optD', 'answer'],
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
          action: 'Action',
        },
        perPage: 10,
        sortable: ['question'],
        filterable: ['question'],
      },
      form: {
        question: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        optE: '',
        answer: '',
        question_type: 'multi_choice',
        point: '1',
      },
      empty_form: {
        question: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        optE: '',
        answer: '',
        question_type: 'multi_choice',
        point: '1',
      },
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      button_type: 'new',
      edit_question_index: '',
      // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }/*, { alias: "imageResize", module: ImageResize }*/],
      // editorSettings: {
      //     modules: {
      //     // imageDrop: true,
      //     //imageResize: {}
      //     }
      // },
      error: false,
      load: false,
      formated_question: '',
      query: {
        page: 1,
        limit: 10,
      },
      total: 0,

    }
  },
  mounted() {
    this.fetchQuestionBank()
  },
  methods: {
    // modifyText() {
    //   const problemSpan = document.getElementById('problem')
    //   // this.formated_question = MQ.StaticMath(problemSpan)
    //   MQ.StaticMath(problemSpan)
    //   const answer = MQ.MathField(problemSpan[0], {
    //     handlers: {
    //       edit() {
    //         // eslint-disable-next-line no-undef
    //         checkAnswer(answer.latex())
    //       },
    //     },
    //   })
    // },
    fetchQuestionBank() {
      const app = this
      app.load = true
      const { limit, page } = this.query
      this.options.perPage = limit
      const fetchQuestionBankResource = new Resource('interview/fetch-questions-bank')
      fetchQuestionBankResource.list(this.query) // back end route from web.php

        .then(response => {
          app.questions = response.questions
          this.questions = response.questions.data
          this.questions.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign
            element.index = (page - 1) * limit + index + 1
          })
          this.total = response.questions.total
          app.load = false
        })
    },
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
    saveForm() {
      const app = this
      app.error = false
      // app.handleCenterLoading();
      const checkEmptyFields = app.form.question === '' || app.form.optA === '' || app.form.optB === '' || app.form.optC === '' /* || app.form.optD === '' */ || app.form.answer === ''

      if (checkEmptyFields === true) {
        app.error = true

        return
      }
      app.load = true
      const formData = app.form
      if (app.button_type === 'edit') {
        const updateQuestion = new Resource('interview/update-question')
        updateQuestion.update(formData.id, formData) // back end route from api.php

          .then(() => {
            app.load = false
            app.fetchQuestionBank()
            app.form = app.empty_form
            app.$message('Question Updated')
            app.add_question = false
            // document.getElementById('view_question_bank').click();
          })
      } else {
        const storeQuestion = new Resource('interview/store-question')
        storeQuestion.store(formData) // back end route from api.php

          .then(response => {
            app.load = false
            app.questions.unshift(response.question)
            app.form = app.empty_form
            app.$message('New Question Added')
          })
      }
    },
    editQuestion(index, question) {
      const app = this
      app.edit_question_index = index - 1
      app.form = question
      app.button_type = 'edit'
      app.add_question = true
    },

  },
}
</script>
