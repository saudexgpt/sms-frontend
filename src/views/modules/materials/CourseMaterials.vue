<template>
  <div v-loading="load">
    <el-card v-if="!readFile">
      <div
        slot="header"
        class="no-print"
      >
        <b-row>
          <b-col
            cols="6"
          >
            <strong>
              Course Materials {{ (selected_subject !== '') ? ' for ' + selected_subject.subject.name : '' }}
            </strong>
          </b-col>
          <b-col
            cols="6"
          >
            <span class="pull-right">
              <el-select
                v-model="selected_subject_index"
                placeholder="Select Subject"
                width="80%"
                filterable
                @input="showMaterials()"
              >
                <template
                  v-for="(subject_teacher, index) in subject_teachers"
                >
                  <el-option
                    v-if="subject_teacher.class_teacher"
                    :key="index"
                    :value="index"
                    :label="`${subject_teacher.subject.name}  (${(subject_teacher.class_teacher) ? subject_teacher.class_teacher.c_class.name : ''})`"
                  />
                </template>

              </el-select>
              &nbsp;
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateClassSidebarActive = true"
              >
                <feather-icon
                  icon="PlusIcon"
                  class="mr-50"
                />
                <span class="align-middle">Create</span>
              </b-button>
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
            :xs="12"
            :sm="8"
            :md="6"
            :lg="6"

            align="center"
          >
            <el-card>
              <el-link
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
                  :style="'font-size: 76px; color: ' + material.subject_teacher.subject.color_code"
                  size="76"
                />
                <p>
                  <strong>{{ material.title }}</strong><br>
                  <small>{{ material.subject_teacher.subject.name }}</small><br>
                  <small>{{ (material.subject_teacher.class_teacher) ? material.subject_teacher.class_teacher.c_class.name : '' }}</small><br>
                </p>
              </el-link><br>
              <el-button
                v-if="material.status === 'active'"
                type="warning"
                size="small"
                @click="changeStatus(material.id, 'inactive')"
              >
                Deactivate
              </el-button>
              <el-button
                v-else
                type="success"
                size="small"
                @click="changeStatus(material.id, 'active')"
              >
                Activate
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="destroy(material.id)"
              >
                Delete
              </el-button>
            </el-card>
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
    <upload-materials
      v-if="isCreateClassSidebarActive"
      v-model="isCreateClassSidebarActive"
      :subject-teachers="subject_teachers"
      @save="showMaterials()"
    />
    <div v-if="readFile">
      <b-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="danger"
        @click="readFile = false"
      >
        Go back
      </b-button>
      <br><br>
      <read-material :material="selectedMaterial" />
    </div>
  </div>
</template>
<script>
import {
  BAlert, BButton, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import UploadMaterials from './UploadMaterials.vue'
import ReadMaterial from './ReadMaterial.vue'

const selectionOptions = new Resource('materials/teacher/subject-materials')

export default {
  components: {
    BAlert,
    BButton,
    BRow,
    BCol,
    UploadMaterials,
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
      selectedMaterial: null,
      readFile: false,

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
      if (app.selected_subject_index !== '') {
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
      }
    },
    destroy(id) {
      const app = this
      const message = 'Are you sure you want to delete this document? Click OK to confirm'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const deleteMaterial = new Resource('materials/delete')
        deleteMaterial.destroy(id)
          .then(() => {
            app.showMaterials()
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    changeStatus(materialId, status) {
      const app = this
      let message = 'Students will NOT be able to access this resource. Click OK to confirm'
      if (status === 'active') {
        message = 'Students will be able to access this resource. Click OK to confirm'
      }
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const deleteMaterial = new Resource('materials/change-status')
        deleteMaterial.update(materialId, { status })
          .then(() => {
            app.showMaterials()
          })
          .catch(error => {
            console.log(error)
          })
      }
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
