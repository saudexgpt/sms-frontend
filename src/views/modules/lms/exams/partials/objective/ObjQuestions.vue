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
      <hr>
      <div>
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
            <label class="red">For the question above, set answer options below. One of them must be correct. When done, click the correct option to aid automatic grading.</label>
          </div>
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
            >
              <label for="optA"><h4>Option A <input
                id="optA"
                v-model="form.answer"
                type="radio"
                value="A"
              ></h4></label>
              <ckeditor
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
              <label for="optB"><h4>Option B <input
                id="optB"
                v-model="form.answer"
                type="radio"
                value="B"
              ></h4></label>
              <ckeditor
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
              <label for="optC"><h4>Option C <input
                id="optC"
                v-model="form.answer"
                type="radio"
                value="C"
              ></h4></label>
              <ckeditor
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
              <label for="optD"><h4>Option D <input
                id="optD"
                v-model="form.answer"
                type="radio"
                value="D"
              ></h4></label>
              <ckeditor
                v-model="form.optD"
                :editor="editor"
                placeholder="Type Option D here..."
                :config="editorConfig"
              />
            </el-col>
          </el-row>
          <p />
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

          <!-- <div class="col-md-6">
                        <label for="optE"><h4>Option E <input type="radio" id="optE" v-model="form.answer" value="E"></h4></label>
                        <vue-editor v-model="form.optE" placeholder="Type Option E here..."></vue-editor>
                    </div> -->
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
      <div
        slot="header"
        class="clearfix"
      >
        <span>
          {{ option.question_type.toUpperCase() }} Question Bank for {{ subjectTeacher.subject.code }} ({{ subjectTeacher.class_teacher.c_class.name }})
        </span>
        <span style="float: right; padding: 3px 0">
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
          <el-button
            type="danger"
            size="small"
            @click="option.question_type= 'select'"
          >Back</el-button>
        </span>
      </div>
      <div class="box-body">
        <v-client-table
          :data="subjectTeacher.questions"
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
                @click="editQuestion(props.index, props.row)"
              ><i class="fa fa-edit" /> Edit</el-button>

            </div>
          </template>

        </v-client-table>
      </div>
    </div>
    <div
      v-if="set_quiz"
      class="box"
    >
      <div slot="header">
        <h4 class="box-title">
          Examination for {{ subjectTeacher.subject.name }} ({{ subjectTeacher.class_teacher.c_class.name }})
        </h4>
        <span class="pull-right"><el-button
          id="view_question_bank"
          class="btn btn-primary"
          @click="add_question=false; set_quiz=false"
        ><i class="fa fa-eye" /> View Question Bank</el-button></span>
      </div>
      <div class="box-body">
        <set-quiz :subject-teacher="subjectTeacher" />
      </div>

    </div>
  </el-card>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import SetQuiz from './SetQuiz.vue'
import Resource from '@/api/resource'
// import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

// import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
// import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency';
// import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical';

// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
// ClassicEditor
//     .create( document.querySelector( '#editor' ), {
//         plugins: [  Essentials, Paragraph, Bold, Italic, Alignment, SpecialCharacters, SpecialCharactersCurrency, SpecialCharactersMathematical,],
//         toolbar: [ 'bold', 'italic', 'alignment', 'specialCharacters' ]
//     } )
//     .then()
//     .catch();

// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// //import ImageResize from 'quill-image-resize-module'

// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
export default {
  components: {
    /* VueEditor, */SetQuiz,
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
      set_quiz: false,
      add_question: false,
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
        sortable: ['question'],
        filterable: ['question'],
      },
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
      // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }/*, { alias: "imageResize", module: ImageResize }*/],
      // editorSettings: {
      //     modules: {
      //     // imageDrop: true,
      //     //imageResize: {}
      //     }
      // },
      error: false,
      load: false,

    }
  },
  mounted() {

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
      if (app.button_type === 'edit') {
        const updateQuestion = new Resource('lms/update-question')
        updateQuestion.update(formData.id, formData) // back end route from api.php

          .then(response => {
            app.load = false
            app.subjectTeacher.questions.splice(app.edit_question_index, 1)
            app.subjectTeacher.questions.push(response.data.question)
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
            app.subjectTeacher.questions.push(response.data.question)
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
