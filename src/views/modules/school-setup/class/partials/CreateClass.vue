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
            Create Class
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
                label="Select Level"
                label-for="v-level"
              >
                <!-- <v-select
                  v-model="form.level"
                  placeholder="Select Level"
                  :options="levels"
                  label="level"
                  value="id"
                /> -->
                <el-select
                  v-model="form.level"
                  style="width: 100%;"
                  placeholder="Select Level"
                  filterable
                >
                  <el-option
                    v-for="(level, index) in levels"
                    :key="index"
                    :label="level.level"
                    :value="level.id"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Arm/Section"
              >
                <!-- <v-select
                  v-model="selectedCurriculumClasss"
                  :options="curriculumClasss"
                  label="class_name"
                  value="id"
                /> -->
                <el-select
                  v-model="form.sections"
                  multiple
                  collapse-tags
                  style="width: 100%;"
                  placeholder="Select Class"
                  filterable
                >
                  <el-option
                    v-for="(section, index) in sections"
                    :key="index"
                    :label="section.name"
                    :value="section.name"
                  />
                </el-select>
                <br>
                <code>You can select multiple Arms/sections</code><br>

                <em>If you do not create your custom class arm/section/label, the default ones (A,B,C,D,...) will be used.</em>
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
    levels: {
      type: Array,
      required: true,
    },
    sections: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      form: {
        level: '',
        sections: [],
      },
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumClasss()
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
    submit() {
      const app = this
      const saveCurriculumSetupResource = new Resource('school-setup/classes')
      const param = app.form
      app.load = true
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.$emit('save', response.class_teachers)
          app.$emit('update:is-create-class-sidebar-active', false)
          app.load = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
