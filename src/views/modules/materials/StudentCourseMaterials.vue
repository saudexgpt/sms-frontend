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
            <strong>
              Course Materials {{ (selected_subject !== '') ? ' for ' + selected_subject.subject.name : '' }}
            </strong>
          </b-col>
          <b-col
            cols="5"
          >
            <span class="pull-right">
              <el-select
                v-model="selected_subject_index"
                placeholder="Select Subject"
                @input="showMaterials()"
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

      <div v-if="show_materials">
        <el-row
          v-if="materials.length > 0"
          :gutter="10"
        >
          <el-col
            v-for="(material, index2) in materials"
            :key="index2"
            :xs="8"
            :sm="6"
            :md="4"
            :lg="4"

            align="center"
          >
            <el-link
              :href="baseServerUrl +'storage/'+material.material"
              target="_blank"
            >
              <img
                :src="baseServerUrl +'images/doc.png'"
                alt="File"
                class="img-polaroid"
                width="80"
              >
              <p>
                <strong>{{ material.title }}</strong><br>
                <small>{{ material.subject_teacher.subject.code + ' (' + material.subject_teacher.class_teacher.c_class.name + ')' }}</small>
              </p>
            </el-link>
          </el-col>
        </el-row>
        <el-row v-else>
          <b-alert
            variant="danger"
            show
          >
            <div class="alert-body">
              <span><strong>There are no materials available for this subject</strong></span>
            </div>
          </b-alert>
        </el-row>
      </div>
      <div
        v-else
        class="no-print"
      >
        <b-alert
          variant="primary"
          show
        >
          <div class="alert-body">
            <span><strong>Please set a subject to view materials</strong></span>
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
    BAlert,
    BRow,
    BCol,
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
      materials: [],
      show_materials: false,
      isCreateClassSidebarActive: false,

    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },

  },
  created() {
    this.setSelectionOptions()
  },
  methods: {
    setSelectionOptions() {
      const app = this
      selectionOptions.list()
        .then(response => {
          app.subject_teachers = response.subject_teachers
        })
        .catch(error => {
          console.log(error)
        })
    },
    // showMaterials() {
    //   const app = this
    //   app.show_materials = false
    //   app.selected_subject = app.subject_teachers[app.selected_subject_index]
    //   app.materials = app.selected_subject.materials
    //   app.show_materials = true
    // },
    showMaterials() {
      const app = this
      app.show_materials = false
      app.selected_subject = app.subject_teachers[app.selected_subject_index]
      app.load = true
      const subjectMaterials = new Resource('materials/subject-materials')
      subjectMaterials.get(app.selected_subject.id)
        .then(response => {
          app.materials = response.materials
          app.load = false
          app.show_materials = true
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
