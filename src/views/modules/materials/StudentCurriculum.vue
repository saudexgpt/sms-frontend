<!--eslint-disable vue/no-v-html-->
<template>
  <div v-loading="load">
    <el-card>
      <div
        slot="header"
        class="no-print"
      >
        <b-row>
          <b-col
            cols="8"
          >
            <h4>
              Subject Curriculum {{ (selected_subject !== '') ? ' for ' + selected_subject.subject.name : '' }}
            </h4>
          </b-col>
          <b-col
            cols="4"
          >
            <span class="pull-right">
              <el-select
                v-model="selected_subject_index"
                style="width: 100%"
                @input="showCurriculum()"
              >
                <el-option
                  v-for="(subject_teacher, index) in subject_teachers"
                  :key="index"
                  :value="index"
                  :label="subject_teacher.subject.name"
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
            <div>
              <el-alert :closable="false">
                Lesson Note for Week {{ week }} by {{ teacher }}
              </el-alert>
              <strong>Topic: {{ title }}</strong>
              <hr>
            </div>
            <div style="background: #fcfcfc; border: 2px #000000 solid; padding: 10px; border-radius: 5px; height: 500px; overflow: auto">
              <div
                v-html="description"
              />
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
                      style="float: right; padding: 3px 0"
                      type="text"
                      @click="setNoteDetails(note);"
                    >Read</el-button>
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
            <span><strong>Please set a subject to view curriculum</strong></span>
          </div>
        </b-alert>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  BAlert, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

const selectionOptions = new Resource('school-setup/student-subject')

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
      show_curriculum: false,
      description: '',
      title: '',
      week: '',
      teacher: '',

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
    //   app.description = (app.selected_subject.curriculum) ? app.selected_subject.curriculum.description : 'No Curriculum was set for this subject. Kindly inform your subject teacher'
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
    setNoteDetails(note) {
      const app = this
      app.title = note.title
      app.description = note.description
      app.week = note.week
      app.teacher = `${note.teacher.user.first_name} ${note.teacher.user.last_name}`
    },
    unsetNoteDetails() {
      const app = this
      app.title = ''
      app.description = ''
      app.week = ''
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
