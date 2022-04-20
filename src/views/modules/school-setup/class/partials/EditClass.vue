<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditClassSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-class-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Class
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
                label="Edit Class Name"
                label-for="v-level"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Enter Class Name"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Edit Arm/Section"
              >
                <b-form-input
                  v-model="form.section"
                  placeholder="Enter Section/Arm"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
                class="mr-1"
                @click="update()"
              >
                Update
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
    prop: 'isEditClassSidebarActive',
    event: 'update:is-edit-class-sidebar-active',
  },
  props: {
    isEditClassSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedCurriculumClass: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        section: '',
      },
      load: false,
    }
  },
  created() {
    this.form.section = this.selectedCurriculumClass.c_class.section
    this.form.name = this.selectedCurriculumClass.c_class.name.replace(` ${this.form.section}`, '')
    this.form.id = this.selectedCurriculumClass.id
  },
  methods: {
    // fetchCurriculumClasss() {
    //   const app = this
    //   const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-class-groups')
    //   fetchCurriculumSetupResource.list()
    //     .then(response => {
    //       app.curriculum_class_groups = response.curriculum_class_groups
    //     })
    // },
    // setClassNames() {
    //   const app = this
    //   app.form.classs = app.selectedCurriculumClasss
    // },
    // setCurriculumClass() {
    //   const app = this
    //   app.curriculumClasss = app.selected_curriculum_group.curriculum_classs
    //   app.form.curriculum_class_group_id = app.selected_curriculum_group.id
    //   app.form.classs = []
    // },
    update() {
      const app = this
      const updateClassResource = new Resource('school-setup/classes')
      const param = app.form
      app.load = true
      updateClassResource.update(param.id, param)
        .then(response => {
          app.$emit('update', response.class_teachers)
          app.$emit('update:is-edit-class-sidebar-active', false)
          app.load = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
