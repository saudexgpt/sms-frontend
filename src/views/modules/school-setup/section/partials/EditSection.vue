<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebarsection="sidebar-lg"
      :visible="isEditSectionSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-editsection-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Section
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
                label="Edit Section Name"
                label-for="v-level"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Enter Section Name"
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
    prop: 'isEditSectionSidebarActive',
    event: 'update:is-editsection-sidebar-active',
  },
  props: {
    isEditSectionSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedSection: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      form: {
        name: '',
      },
      load: false,
    }
  },
  created() {
    this.form = this.selectedSection
  },
  methods: {
    // fetchCurriculumSections() {
    //   const app = this
    //   const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculumsection-groups')
    //   fetchCurriculumSetupResource.list()
    //     .then(response => {
    //       app.curriculum_class_groups = response.curriculum_class_groups
    //     })
    // },
    // setSectionNames() {
    //   const app = this
    //   app.form.classs = app.selectedCurriculumSections
    // },
    // setCurriculumSection() {
    //   const app = this
    //   app.curriculumSections = app.selected_curriculum_group.curriculum_classs
    //   app.form.curriculum_class_group_id = app.selected_curriculum_group.id
    //   app.form.classs = []
    // },
    update() {
      const app = this
      const updateSectionResource = new Resource('school-setup/sections')
      const param = app.form
      app.load = true
      updateSectionResource.update(param.id, param)
        .then(response => {
          app.$emit('update', response.sections)
          app.$emit('update:is-editsection-sidebar-active', false)
          app.load = false
        }).catch(() => {
          app.load = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
