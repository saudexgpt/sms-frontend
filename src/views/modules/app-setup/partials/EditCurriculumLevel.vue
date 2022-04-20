<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditLevelSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-level-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Curriculum Level
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
          <b-row v-loading="loading">

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Select Curriculum"
                label-for="v-curriculum"
              >
                <v-select
                  v-model="selected_curriculum"
                  :options="curricula"
                  label="name"
                  value="id"
                  @input="setCurriculumGroup()"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Level Group"
                label-for="v-curriculum"
              >
                <v-select
                  v-model="selectedCurriculumLevelGroups"
                  :options="curriculumLevelGroups"
                  label="name"
                  value="id"
                />
              </b-form-group>
            </b-col>
            <!-- Level Name -->
            <b-col cols="12">
              <b-form-group
                label="Level Name"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.level_name"
                  placeholder="Eg: Kindergarten, Nursery One, etc"
                />
              </b-form-group>
            </b-col>
            <!-- Abbrev -->
            <b-col cols="12">
              <b-form-group
                label="Level Abbreviation"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.abbrev"
                  placeholder="Eg: KG, Nur 1, Pry 1, etc"
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
            <b-col
              v-if="error"
              cols="12"
            >
              <b-alert
                variant="danger"
                show
              >
                <div class="alert-body">
                  <span><strong>{{ error_message }}</strong></span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    vSelect,
    BAlert,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEditLevelSidebarActive',
    event: 'update:is-edit-level-sidebar-active',
  },
  props: {
    isEditLevelSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedCurriculumLevel: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      form: {
        level_name: '',
        abbrev: '',
        curriculum_category_id: '',
        curriculum_level_group_id: '',
      },
      selected_curriculum: '',
      curricula: [],
      curriculumLevelGroups: [],
      selectedCurriculumLevelGroups: '',
      loading: false,
      error: false,
      error_message: '',
    }
  },
  created() {
    this.form = this.selectedCurriculumLevel
    this.selected_curriculum = this.form.curriculum_category
    this.fetchCurriculumSetup()
    this.selectedCurriculumLevelGroups = this.form.curriculum_level_group
  },
  methods: {
    fetchCurriculumSetup() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('fetch-curriculum-setup')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curricula = response.curricula
        })
    },
    setCurriculumGroup() {
      const app = this
      app.curriculumLevelGroups = app.selected_curriculum.curriculum_level_groups
    },
    update() {
      const app = this
      app.loading = true
      const updateCurriculumSetupResource = new Resource('curriculum/level/update')
      const param = app.form
      param.curriculum_category_id = app.selected_curriculum.id
      param.curriculum_level_group_id = app.selectedCurriculumLevelGroups.id
      updateCurriculumSetupResource.update(param.id, param)
        .then(response => {
          app.loading = false
          app.$emit('update', response)
          app.$emit('update:is-edit-level-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
