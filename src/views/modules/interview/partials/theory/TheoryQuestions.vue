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
          Add {{ option.question_type.toUpperCase() }} questions to {{ subjectTeacher.subject.name }} question bank
        </span>
        <span class="pull-right">
          <el-button
            class="btn btn-warning"
            size="small"
            @click="add_question=false"
          >View Question Bank</el-button>
        </span>
      </div>
      <div class="box-body">
        <form @submit.prevent="saveForm()">
          <div class="col-md-12">
            <h4>Question</h4>
            <!-- <vue-editor v-model="form.question" :customModules="customModulesForEditor" :editorOptions="editorSettings" placeholder="Type your question here..."></vue-editor> -->
            <ckeditor
              v-model="form.question"
              :editor="editor"
              :config="editorConfig"
            />
          </div>

          <div class="col-md-12">
            <h4>Assign Point to Question</h4>
            <input
              v-model="form.point"
              type="number"
              class="form-control"
            >

          </div>
          <div v-if="button_type == 'new'">
            <button class="btn btn-success btn-lg">
              <i class="fa fa-save" /> Save Question
            </button>
          </div>
          <div v-if="button_type == 'edit'">
            <button class="btn btn-primary btn-lg">
              <i class="fa fa-edit" /> Update Question
            </button>
          </div>

        </form>
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
      <div class="box-header">
        <h4 class="box-title">
          {{ option.question_type.toUpperCase() }} Question Bank for {{ subjectTeacher.subject.code }} ({{ subjectTeacher.class_teacher.c_class.name }})
        </h4>
        <span class="pull-right">
          <el-button
            type="warning"
            size="small"
            @click="add_question=true"
          ><i class="fa fa-plus" /> Add New Question</el-button>
          <el-button
            type="primary"
            size="small"
            @click="set_quiz=true"
          ><i class="fa fa-question" /> Set Exam</el-button>
          <!-- <el-button
            type="danger"
            size="small"
            @click="option.question_type= 'select'"
          >Back</el-button> -->
        </span>
      </div>
      <div class="box-body">
        <v-client-table
          :data="subjectTeacher.theory_questions"
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
            slot="action"
            slot-scope="props"
          >
            <div class="table__actions">

              <a
                class="btn btn-primary"
                @click="editQuestion(props.index, props.row)"
              ><i class="fa fa-edit" /> Edit</a>

            </div>
          </template>

        </v-client-table>
      </div>
    </div>
    <div
      v-if="set_quiz"
      class="box"
    >
      <div class="box-header">
        <h4 class="box-title">
          Examination for {{ subjectTeacher.subject.name }} ({{ subjectTeacher.class_teacher.c_class.name }})
        </h4>
        <span class="pull-right"><a
          id="view_question_bank"
          class="btn btn-primary"
          @click="add_question=false; set_quiz=false"
        ><i class="fa fa-eye" /> View Question Bank</a></span>
      </div>
      <div class="box-body">
        <set-quiz :subject-teacher="subjectTeacher" />
      </div>

    </div>
  </el-card>
</template>
<script>
import CKEditor from 'ckeditor4-vue'
import SetQuiz from './SetQuiz.vue'
import Resource from '@/api/resource'
// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-vue'//'quill-image-resize-module'

// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
export default {
  components: {
    SetQuiz,
    ckeditor: CKEditor.component,
  },
  props: {
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },
    option: {
      type: Object,
      default: () => ({
        question_type: 'theory',
      }),
    },

  },
  data() {
    return {
      set_quiz: false,
      add_question: false,
      columns: ['action', 'question', 'point'],
      options: {
        headings: {
          question: 'Question',
          point: 'Point',
          action: 'Action',
        },
        sortable: ['question'],
        filterable: ['question'],
      },
      form: {
        subject_teacher_id: this.subjectTeacher.id,
        question: '',
        point: 10,
        question_type: 'theory',

      },
      empty_form: {
        subject_teacher_id: this.subjectTeacher.id,
        question: '',
        point: 10,
        question_type: 'theory',
      },
      button_type: 'new',
      edit_question_index: '',
      editor: '',
      editorConfig: {
        // The configuration of the editor.
      },
      // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
      // editorSettings: {
      //     modules: {
      //     imageDrop: true,
      //     imageResize: {}
      //     }
      // },
      error: false,
      load: false,

    }
  },
  methods: {
    saveForm() {
      const app = this
      app.error = false
      const checkEmptyFields = app.form.question === ''

      if (checkEmptyFields === true) {
        app.error = true

        return
      }
      app.load = true
      const formData = app.form
      if (app.button_type === 'edit') {
        const updateQuestion = new Resource('lms/update-question')
        updateQuestion.update(formData.id, formData) // back end route from api.php

          .then(response => {
            app.load = false
            app.subjectTeacher.theory_questions.splice(app.edit_question_index, 1)
            app.subjectTeacher.theory_questions.push(response.question)
            app.form = app.empty_form
            app.$message('Question Updated')
            app.add_question = false
            // document.getElementById('view_question_bank').click();
          })
      } else {
        const storeQuestion = new Resource('lms/store-question')
        storeQuestion.store(formData) // back end route from api.php

          .then(response => {
            app.load = false
            app.subjectTeacher.theory_questions.push(response.question)
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
