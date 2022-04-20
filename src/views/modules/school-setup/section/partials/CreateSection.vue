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
            Create Class Section/Arm
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
                label="Section Name"
                label-for="v-level"
              >
                <small>Type your preferred Class Arm/Section and press <code>Enter</code></small><br>
                <code>Example: A, B, C, Diamond, Gold, Silver etc</code><br>
                <el-select
                  v-model="form.name"
                  multiple
                  allow-create
                  style="width: 100%;"
                  placeholder="Section Name"
                  filterable
                  default-first-option
                >
                  <el-option
                    v-for="(each_name, index) in form.name"
                    :key="index"
                    :label="each_name"
                    :value="each_name"
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
  },
  data() {
    return {
      form: {
        name: [],
      },
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumClasss()
  },
  methods: {
    submit() {
      const app = this
      const saveCurriculumSetupResource = new Resource('school-setup/sections')
      const param = app.form
      app.load = true
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.$emit('save', response.sections)
          app.$emit('update:is-create-class-sidebar-active', false)
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
