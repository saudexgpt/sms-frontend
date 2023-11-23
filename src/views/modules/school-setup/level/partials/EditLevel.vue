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
            Edit Level
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
                label="Select Curriculum"
                label-for="v-curriculum"
              >
                <v-select
                  v-model="selected_curriculum_category"
                  placeholder="Select Curriculum"
                  :options="curriculum_categories"
                  label="name"
                  value="id"
                  @input="setCurriculumLevelGroups()"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Level Group"
                label-for="v-curriculum_level_group"
              >
                <el-select
                  v-model="form.curriculum_level_group_id"
                  collapse-tags
                  style="width: 100%;"
                  placeholder="Select Level Group"
                >
                  <el-option
                    v-for="(curriculum_level_group, index) in curriculum_level_groups"
                    :key="index"
                    :label="curriculum_level_group.name"
                    :value="curriculum_level_group.id"
                  />
                </el-select>
                <!-- <v-select
                  v-model="form.curriculum_level_group_id"
                  placeholder="Select Level Group"
                  :options="curriculum_level_groups"
                  label="name"
                  value="id"
                /> -->
              </b-form-group>
            </b-col>
            <!-- <b-col cols="12">
              <b-form-group
                label="Level Group"
                label-for="v-curriculum"
              >
                <b-form-input
                  id="basicInput"
                  v-model="form.level_group.name"
                  readonly
                />
              </b-form-group>
            </b-col> -->
            <b-col cols="12">
              <b-form-group
                label="Edit Level Name"
              >
                <!-- <v-select
                  v-model="selectedCurriculumLevels"
                  :options="curriculumLevels"
                  label="level_name"
                  value="id"
                /> -->
                <b-form-input
                  id="basicInput"
                  v-model="form.level"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Edit Level Description"
              >
                <b-form-input
                  id="basicInput"
                  v-model="form.description"
                />
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="success"
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
import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BButton, BFormInput,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    vSelect,
    BFormInput,
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
        level: '',
        description: '',
        curriculum_level_group_id: '',
      },
      selected_curriculum: '',
      curricula: [],
      curriculum_categories: [],
      selected_curriculum_category: '',
      curriculum_level_groups: [],
      selected_curriculum_group: '',
      curriculumLevels: [],
      load: false,
    }
  },
  created() {
    this.form = this.selectedCurriculumLevel
    this.selected_curriculum = this.form.curriculum_setup
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-curriculum-categories')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculum_categories = response.curriculum_categories
          const curriculumCategoryId = app.form.level_group.curriculum_category_id
          const index = app.curriculum_categories.findIndex(object => object.id === curriculumCategoryId)
          app.selected_curriculum_category = app.curriculum_categories[index]
          app.curriculum_level_groups = app.selected_curriculum_category.curriculum_level_groups
        })
    },
    setCurriculumLevelGroups() {
      const app = this
      app.curriculum_level_groups = app.selected_curriculum_category.curriculum_level_groups
      app.form.curriculum_level_group_id = ''
    },
    update() {
      const app = this
      if (app.form.curriculum_level_group_id === '') {
        app.$alert('Please select level group')
        return
      }
      const updateCurriculumSetupResource = new Resource('school-setup/level/update')
      const param = app.form
      updateCurriculumSetupResource.update(param.id, param)
        .then(response => {
          app.$emit('update', response.levels)
          app.$emit('update:is-edit-level-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
