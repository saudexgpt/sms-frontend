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
            Upload Course Material
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
                label="Select Subject"
              >
                <el-select
                  v-model="subject_teacher_id"
                  style="width: 100%"
                >
                  <template
                    v-for="(subject_teacher, index) in subjectTeachers"
                  >

                    <el-option
                      v-if="userData.staff.id === subject_teacher.teacher_id"

                      :key="index"
                      :value="subject_teacher.id"
                      :label="subject_teacher.subject.name + ' (' + subject_teacher.class_teacher.c_class.name + ')'"
                    />
                  </template>
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Title"
              >
                <el-input
                  v-model="title"
                  type="text"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select File (PDF file only)"
              >
                <input
                  type="file"
                  class="form-control"
                  @change="onImageChange"
                >
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
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
    subjectTeachers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      subject_teacher_id: '',
      title: '',
      load: false,
      file_to_be_uploaded: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    userData() {
      return this.$store.getters.userData
    },
  },
  created() {
    // this.fetchCurriculumClasss()
  },
  methods: {
    onImageChange(e) {
      const app = this
      // console.log(e)
      // eslint-disable-next-line prefer-destructuring
      app.file_to_be_uploaded = e.target.files[0]

      // app.submit()
    },
    submit() {
      const app = this
      const saveCurriculumSetupResource = new Resource('materials/store')
      app.load = true
      const formData = new FormData()
      formData.append('title', app.title)
      formData.append('material', app.file_to_be_uploaded)
      formData.append('subject_teacher_id', app.subject_teacher_id)
      saveCurriculumSetupResource.store(formData)
        .then(response => {
          app.$emit('save', response.class_teachers)
          app.$emit('update:is-create-class-sidebar-active', false)
          app.load = false
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.data.message)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
