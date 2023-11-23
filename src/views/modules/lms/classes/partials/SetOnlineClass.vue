<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateClassSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-class-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Class for {{ `${subjectTeacher.subject.name} (${subjectTeacher.class_teacher.c_class.name})` }}
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="load">

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Topic for this class"
                label-for="v-level"
              >
                <el-input
                  v-model="form.topic"
                  type="text"
                  placeholder="Example: Introduction of Computer"
                  required
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Brief description of topic"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Example: Computer is an electronic machine that accepts data...and so on"
                  required
                />
                <br>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Date of class"
              >
                <el-date-picker
                  v-model="form.date"
                  :picker-options="pickerOptions"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Pick a day"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Start Time"
              >
                <el-time-select
                  v-model="form.start"
                  placeholder="Start time"
                  :picker-options="{
                    start: '08:00:00',
                    step: '00:15:00',
                    end: '20:00:00'
                  }"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="End Time"
              >
                <el-time-select
                  v-model="form.end"
                  placeholder="End time"
                  :picker-options="{
                    start: '08:00:00',
                    step: '00:15:00',
                    end: '20:00:00',
                    minTime: form.start
                  }"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="success"
                class="mr-1"
                @click="saveClass()"
              >
                Create
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
// import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // vSelect,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateClassSidebarActive',
    event: 'update:is-create-class-sidebar-active',
  },
  props: {
    isCreateClassSidebarActive: {
      type: Boolean,
      required: true,
    },
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 3600 * 1000 * 24)
        },
      },
      form: {
        topic: '',
        description: '',
        date: '',
        start: '',
        end: '',
        subject_teacher_id: this.subjectTeacher.id,
        class_teacher_id: this.subjectTeacher.class_teacher_id,
        // day: this.day,
      },
      empty_form: {
        topic: '',
        description: '',
        date: '',
        start: '',
        end: '',
        subject_teacher_id: this.subjectTeacher.id,
        class_teacher_id: this.subjectTeacher.class_teacher_id,
        // day: this.day,
      },
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumClasss()
  },
  methods: {
    aFieldIsEmpty() {
      const app = this
      return app.form.topic === '' || app.form.description === '' || app.form.date === '' || app.form.start === '' || app.form.end === ''
    },
    saveClass() {
      const app = this
      if (app.aFieldIsEmpty()) {
        app.$alert('Kindly fill all empty fields')
        return
      }
      const param = app.form
      const createOnlineClassResource = new Resource('lms/create-online-class')
      app.load = true
      createOnlineClassResource
        .store(param) // back end route from web.php
        .then(() => {
          app.load = false
          app.$message('Online Class Scheduled')
          app.$emit('save')
          app.$emit('update:is-create-class-sidebar-active', false)
          app.form = app.empty_form
          app.create_new = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
