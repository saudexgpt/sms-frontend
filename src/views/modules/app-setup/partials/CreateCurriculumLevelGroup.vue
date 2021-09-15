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
        name: '',
      },
      selected_curriculum: '',
      curricula: [],
      loading: false,
    }
  },
  created() {
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
    submit() {
      const app = this
      app.loading = true
      const saveCurriculumSetupResource = new Resource('curriculum/level-group/save')
      const param = app.form
      param.curriculum_id = app.selected_curriculum.id
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response)
          app.$emit('update:is-create-level-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
