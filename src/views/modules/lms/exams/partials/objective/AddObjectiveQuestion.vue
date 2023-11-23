<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card v-loading="load">
    <div class="box">

      <div slot="header">
        <span
          v-if="button_type === 'new'"
        >
          Add {{ option.question_type.toUpperCase() }} questions to {{ subjectTeacher.subject.name }} question bank
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
  </el-card>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Resource from '@/api/resource'

export default {
  components: {
  },
  props: {
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },
    option: {
      type: Object,
      default: () => ({
        question_type: 'objective',
      }),
    },

  },
  data() {
    return {
      form: {
        subject_teacher_id: this.subjectTeacher.id,
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
        subject_teacher_id: this.subjectTeacher.id,
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
      error: false,
      load: false,
      formated_question: '',

    }
  },
  mounted() {
    // this.modifyText()
  },
  methods: {
    saveForm() {
      const app = this
      app.error = false
      // app.handleCenterLoading();
      const checkEmptyFields = app.form.question === '' || app.form.optA === '' || app.form.optB === '' || app.form.optC === '' || app.form.optD === '' || app.form.answer === ''

      if (checkEmptyFields === true) {
        app.error = true

        return
      }
      app.load = true
      const formData = app.form
      const storeQuestion = new Resource('lms/store-question')
      storeQuestion.store(formData) // back end route from api.php

        .then(response => {
          app.load = false
          app.subjectTeacher.questions.push(response.question)
          app.form = app.empty_form
          app.$message('New Question Added')
        })
    },

  },
}
</script>
