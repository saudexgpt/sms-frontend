<template>
  <div>
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
          <b-row>

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Select Class"
                label-for="v-class"
              >
                <el-select
                  v-model="form.subject_teacher_id"
                  placeholder="Select Subject"
                  class="span"
                  style="width: 100%;"
                  filterable
                >
                  <el-option
                    v-for="(subject_teacher, index) in subject_teachers"
                    :key="index"
                    :value="subject_teacher.id"
                    :label="subject_teacher.subject.name"
                  >
                    <span style="float: left">{{ subject_teacher.subject.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">&nbsp;&nbsp;by {{ (subject_teacher.staff) ? subject_teacher.staff.user.first_name + ' ' + subject_teacher.staff.user.last_name + ')' : '' }}</span>
                  </el-option>
                </el-select>
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
      curriculum_level_groups: [],
      selected_curriculum_group: '',
      curriculumLevels: [],
      selectedCurriculumLevels: [],
    }
  },
  created() {
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-level-groups')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculum_level_groups = response.curriculum_level_groups
        })
    },
    setLevelNames() {
      const app = this
      app.form.levels = app.selectedCurriculumLevels
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
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.$emit('save', response.levels)
          app.$emit('update:is-create-level-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
