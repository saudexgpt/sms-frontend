<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditSalaryScaleSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-salary-scale-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Salary Scale
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
              <strong>All fields are required</strong>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label="Scale Title"
              >
                <el-input
                  v-model="form.name"
                  placeholder="E.g Senior Staff"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                :label="'Salary Scale for ' + form.name"
              >
                <el-input
                  v-model="form.salary"
                  placeholder="Enter Amount"
                >
                  <template #prepend>
                    {{ currency }}
                  </template>
                </el-input>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
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
    prop: 'isEditSalaryScaleSidebarActive',
    event: 'update:is-edit-salary-scale-sidebar-active',
  },
  props: {
    isEditSalaryScaleSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedSalaryScale: {
      type: Object,
      default: () => (null),
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        salary: '',
      },
      load: false,
      vat_percentage: 0,
    }
  },
  created() {
    this.form.salary = this.selectedSalaryScale.salary
    this.form.name = this.selectedSalaryScale.name
    this.form.id = this.selectedSalaryScale.id
  },
  methods: {
    update() {
      const app = this
      const updateClassResource = new Resource('account/salary/scale/update')
      const param = app.form
      app.load = true
      updateClassResource.update(param.id, param)
        .then(() => {
          app.$emit('update')
          app.$emit('update:is-edit-salary-scale-sidebar-active', false)
          app.load = false
        }).catch(() => {
          app.load = false
          app.$message('An error occured')
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
