<template>
  <div v-loading="load">
    <el-card>
      <div
        slot="header"
        class="no-print"
      >
        <b-row>
          <b-col
            cols="7"
          >
            <h4>
              Lesson Plan {{ (selected_subject !== '') ? ' for ' + selected_subject.subject.name : '' }}
            </h4>
          </b-col>
          <b-col
            cols="5"
          >
            <span class="pull-right">
              <el-select
                v-model="selected_subject_index"
                filterable
                style="width: 100%"
                @input="showCurriculum()"
              >
                <el-option
                  v-for="(subject_teacher, index) in subject_teachers"
                  :key="index"
                  :value="index"
                  :label="`${subject_teacher.subject.name} ${( subject_teacher.class_teacher ) ? '('+ subject_teacher.class_teacher.c_class.name + ')' : ''}`"
                />
              </el-select>
            </span>
          </b-col>
        </b-row>
      </div>

      <div v-if="show_curriculum">
        <el-row :gutter="10">
          <el-col
            :xs="24"
            :sm="16"
          >
            <div v-if="can_edit">
              <el-alert
                :closable="false"
                type="success"
              >
                Lesson Note for Week {{ week }} by {{ teacher }}
              </el-alert>
              <small>Lesson Week</small>
              <el-select
                v-model="week"
                placeholder="Select Lesson Week"
                style="width: 100%"
              >
                <el-option
                  v-for="(num, index) in 14"
                  :key="index"
                  :value="num"
                  :label="`Week ${num}`"
                />
              </el-select>
              <hr>
              <small>Topic</small>
              <el-input
                v-model="title"
                placeholder="Topic of Lesson"
              />
              <hr>
              <small>Detailed Note</small>
              <ckeditor
                v-model="description"
                :editor="editor"
                :config="editorConfig"
              />
              <div v-if="week !== ''">
                <br>
                <el-button
                  v-if="title === ''"
                  type="primary"
                  @click="updateCurriculum()"
                >Save</el-button>
                <el-button
                  v-else
                  type="warning"
                  @click="updateCurriculum()"
                >Update</el-button>
              </div>
            </div>
            <div v-else>
              <el-alert
                :closable="false"
                type="success"
              >
                Lesson Note for Week {{ week }} by {{ teacher }}
              </el-alert>
              <hr>
              <strong>Topic: {{ title }}</strong>
              <hr>
              <div style="background: #fcfcfc; border: 2px #000000 solid; padding: 10px; border-radius: 5px; height: 500px; overflow: auto">
                <!--eslint-disable-next-line vue/no-v-html -->
                <span v-html="description" />
              </div>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="8"
          >
            <aside style="height: 650px; overflow: auto">
              <div
                v-for="(note, note_index) in notes"
                :key="note_index"
              >
                <el-card
                  class="box-card"
                >
                  <div
                    slot="header"
                    class="clearfix"
                  >
                    <span>Week {{ note.week }}</span>
                    <el-button
                      v-if="note.teacher_id === teacher_id"
                      style="float: right; padding: 3px 0"
                      type="text"
                      @click="setNoteDetails(note);"
                    >Edit</el-button>
                    <el-button
                      v-else
                      style="float: right; padding: 3px 0"
                      type="text"
                      @click="setNoteDetails(note);"
                    >View</el-button>
                  </div>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  Topic: <strong>{{ note.title }}</strong>
                </el-card>
                <hr>
              </div>
            </aside>
          </el-col>
        </el-row>
      </div>
      <div
        v-else
        class="no-print"
      >
        <b-alert
          variant="danger"
          show
        >
          <div class="alert-body">
            <span><strong>Please set a subject to view/update curriculum</strong></span>
          </div>
        </b-alert>
      </div>
    </el-card>
  </div>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  BAlert, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

const selectionOptions = new Resource('materials/teacher-curriculum')

export default {
  components: {
    BAlert, BRow, BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      subject_teachers: [],
      load: false,
      selected_subject_index: '',
      selected_subject: '',
      notes: [],
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
        placeholder: 'Type your lesson details here...',
      },
      show_curriculum: false,
      description: '',
      week: '',
      title: '',
      teacher_id: '',
      teacher: '',
      can_edit: false,

    }
  },

  created() {
    this.setSelectionOptions()
  },
  methods: {
    setSelectionOptions() {
      const app = this
      app.load = true
      selectionOptions.list()
        .then(response => {
          app.load = false
          app.subject_teachers = response.subject_teachers
          app.teacher_id = response.teacher_id
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },
    // showCurriculum() {
    //   const app = this
    //   app.show_curriculum = false
    //   app.selected_subject = app.subject_teachers[app.selected_subject_index]
    //   app.notes = (app.selected_subject.curriculum) ? app.selected_subject.curriculum : ''
    //   app.show_curriculum = true
    // },
    showCurriculum() {
      const app = this
      app.show_curriculum = false
      app.selected_subject = app.subject_teachers[app.selected_subject_index]
      app.load = true
      app.unsetNoteDetails()
      const subjectMaterials = new Resource('materials/subject-curriculum')
      subjectMaterials.get(app.selected_subject.id)
        .then(response => {
          app.notes = response.curriculum
          app.load = false
          if (app.notes.length > 0) {
            app.setNoteDetails(app.notes[0])
          }
          app.show_curriculum = true
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },
    updateCurriculum() {
      const app = this
      const param = {
        subject_teacher_id: app.selected_subject.id,
        description: app.description,
        week: app.week,
        title: app.title,
      }
      app.load = true
      const saveCurriculum = new Resource('materials/save-curriculum')
      saveCurriculum.store(param)
        .then(() => {
          app.setSelectionOptions()
          app.showCurriculum()
          app.load = false
          app.$message('Curriculum Updated Successfully')
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },
    setNoteDetails(note) {
      const app = this
      app.title = note.title
      app.description = note.description
      app.week = note.week
      app.can_edit = false
      if (note.teacher_id === app.teacher_id) {
        app.can_edit = true
      }
      app.teacher = `${note.teacher.user.first_name} ${note.teacher.user.last_name}`
    },
    unsetNoteDetails() {
      const app = this
      app.title = ''
      app.description = ''
      app.week = ''
      app.can_edit = false
      app.teacher = ''
    },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
