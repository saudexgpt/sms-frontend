<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-subject="sidebar-lg"
      :visible="isCreateSubjectSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-subject-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Subject
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
            <b-col cols="12">
              <b-form-group
                label="Subject Title"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Subject Title"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Subject Code"
              >
                <b-form-input
                  v-model="form.code"
                  placeholder="Subject Code"
                />
              </b-form-group>
            </b-col>
            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Select Level Group"
                label-for="v-level"
              >
                <el-select
                  v-model="form.level_group"
                  style="width: 100%;"
                  placeholder="Select Level Group"
                  filterable
                  multiple
                >
                  <el-option
                    v-for="(level, index) in levelGroups"
                    :key="index"
                    :label="level.name"
                    :value="level.id"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
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
  BSidebar, BRow, BCol, BFormGroup, BButton, BFormInput,
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
    BFormInput,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateSubjectSidebarActive',
    event: 'update:is-create-subject-sidebar-active',
  },
  props: {
    isCreateSubjectSidebarActive: {
      type: Boolean,
      required: true,
    },
    levelGroups: {
      type: Array,
      required: true,
    },
    // sections: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
        level_group: [],
      },
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumSubjects()
  },
  methods: {
    // fetchCurriculumSubjects() {
    //   const app = this
    //   const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-subject-groups')
    //   fetchCurriculumSetupResource.list()
    //     .then(response => {
    //       app.curriculum_class_groups = response.curriculum_class_groups
    //     })
    // },
    // setSubjectNames() {
    //   const app = this
    //   app.form.classs = app.selectedCurriculumSubjects
    // },
    // setCurriculumSubject() {
    //   const app = this
    //   app.curriculumSubjects = app.selected_curriculum_group.curriculum_classs
    //   app.form.curriculum_class_group_id = app.selected_curriculum_group.id
    //   app.form.classs = []
    // },
    submit() {
      const app = this
      const saveSubjectsResource = new Resource('school-setup/subjects')
      const param = app.form
      app.load = true
      saveSubjectsResource.store(param)
        .then(response => {
          app.load = false
          app.$emit('save', response.level_groups)
          app.$emit('update:is-create-subject-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
