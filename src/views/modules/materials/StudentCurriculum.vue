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
          <el-col :xs="24">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="description" />
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
      description: '',
      show_curriculum: false,

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
    showCurriculum() {
      const app = this
      app.show_curriculum = false
      app.selected_subject = app.subject_teachers[app.selected_subject_index]
      app.description = (app.selected_subject.curriculum) ? app.selected_subject.curriculum.description : 'No Curriculum was set for this subject. Kindly inform your subject teacher'
      app.show_curriculum = true
    },
  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
