<template>
  <div v-loading="load">
    <div>
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
            :xs="24"
            :sm="18"
            :md="18"
            :lg="18"
          >
            <div
              v-if="readFile"
              style="background: #fcfcfc; border: 2px #f0f0f0 solid; padding: 10px; border-radius: 5px; height: 650px; overflow: auto"
            >
              <read-material :material="selectedMaterial" />
            </div>
            <div
              v-else
              style="background: #fcfcfc; border: 2px #000000 solid; padding: 10px; border-radius: 5px; height: 650px; overflow: auto"
            >
              <el-empty description="Click on a material to view the content" />
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="6"
            :md="6"
            :lg="6"
          >
            <aside style="height: 650px; overflow: auto">
              <small>Available Materials</small>
              <div
                v-for="(material, index2) in materials"
                :key="index2"

                align="center"
              >
                <el-card>
                  <div
                    style="cursor: pointer"
                    @click="readMaterial(material)"
                  >
                    <!-- <img
                  :src="baseServerUrl +'images/doc.png'"
                  alt="File"
                  class="img-polaroid"
                  width="80"
                > -->
                    <feather-icon
                      icon="FileTextIcon"
                      :style="'font-size: 60px; color: ' + material.subject_teacher.subject.color_code"
                      size="60"
                    />
                    <p>
                      <strong>{{ material.title }}</strong><br>
                      <small>{{ material.subject_teacher.subject.name }}</small><br>
                      <small>{{ material.subject_teacher.class_teacher.c_class.name }}</small><br>
                    </p>
                  </div>
                </el-card>
                <hr>
              </div>
            </aside>
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
    </div>
    <!-- <div v-if="readFile">
      <b-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="danger"
        @click="readFile = false"
      >
        Go back
      </b-button>
      <br><br>
      <read-material :material="selectedMaterial" />
    </div> -->
  </div>
</template>
<script>
import {
  BAlert, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import ReadMaterial from './ReadMaterial.vue'

const selectionOptions = new Resource('school-setup/student-subject')

export default {
  components: {
    // BButton,
    BAlert,
    BRow,
    BCol,
    ReadMaterial,
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
      readFile: false,
      selectedMaterial: null,

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
      app.readFile = false
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
    readMaterial(material) {
      const app = this
      app.readFile = false
      app.selectedMaterial = null
      setTimeout(() => {
        app.selectedMaterial = material
        app.readFile = true
      }, 100)
    },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
