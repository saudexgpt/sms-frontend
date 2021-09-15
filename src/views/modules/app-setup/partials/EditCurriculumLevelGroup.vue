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
                />
              </b-form-group>
            </b-col>

            <!-- Level Group -->
            <b-col cols="12">
              <b-form-group
                label="Level Group"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Eg: Pre-School, Nursery, High School, Primary, Secondary, etc"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="6">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="danger"
                class="mr-1"
                @click="hide"
              >
                Cancel
              </b-button>
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
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton,
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
        level_group: '',
        level_name: '',
        abbrev: '',
      },
      selected_curriculum: '',
      curricula: [],
      loading: false,
    }
  },
  created() {
    this.form = this.selectedCurriculumLevel
    this.selected_curriculum = this.form.curriculum_category
    this.fetchCurriculumSetup()
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
    update() {
      const app = this
      app.loading = true
      const updateCurriculumSetupResource = new Resource('curriculum/level-group/update')
      const param = app.form
      param.curriculum_id = app.selected_curriculum.id
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
