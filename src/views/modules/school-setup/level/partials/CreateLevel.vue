<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateLevelSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-level-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Curriculum Level
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
                <v-select
                  v-model="selected_curriculum_group"
                  placeholder="Select Level Group"
                  :options="curriculum_level_groups"
                  label="name"
                  value="id"
                  @input="setCurriculumLevel()"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Level (multiple selection supported)"
              >
                <!-- <v-select
                  v-model="selectedCurriculumLevels"
                  :options="curriculumLevels"
                  label="level_name"
                  value="id"
                /> -->
                <el-select
                  v-model="form.levels"
                  multiple
                  collapse-tags
                  style="width: 100%;"
                  placeholder="Select Level"
                >
                  <el-option
                    v-for="(level, index) in curriculumLevels"
                    :key="index"
                    :label="level.level_name + ' (' + level.abbrev + ')'"
                    :value="level.level_name"
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
import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    vSelect,
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
    prop: 'isCreateLevelSidebarActive',
    event: 'update:is-create-level-sidebar-active',
  },
  props: {
    isCreateLevelSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        levels: [],
        curriculum_level_group_id: '',
      },
      curriculum_categories: [],
      selected_curriculum_category: '',
      curriculum_level_groups: [],
      selected_curriculum_group: '',
      curriculumLevels: [],
      selectedCurriculumLevels: [],
      load: false,
    }
  },
  created() {
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-curriculum-categories')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculum_categories = response.curriculum_categories
        })
    },
    setLevelNames() {
      const app = this
      app.form.levels = app.selectedCurriculumLevels
    },
    setCurriculumLevelGroups() {
      const app = this
      app.curriculum_level_groups = app.selected_curriculum_category.curriculum_level_groups
      app.form.curriculum_level_group_id = ''
    },
    setCurriculumLevel() {
      const app = this
      app.curriculumLevels = app.selected_curriculum_group.curriculum_levels
      app.form.curriculum_level_group_id = app.selected_curriculum_group.id
      app.form.levels = []
    },
    submit() {
      const app = this
      const saveCurriculumSetupResource = new Resource('school-setup/level/save')
      const param = app.form
      app.load = true
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.$emit('save', response.levels)
          app.$emit('update:is-create-level-sidebar-active', false)
          app.load = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
