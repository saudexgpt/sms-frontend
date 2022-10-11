<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreatePinSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-pin-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Generate Registration Pin
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
                label="Select Pin Type"
                label-for="v-level"
              >
                <el-select
                  v-model="form.pin_type"
                  style="width: 100%;"
                  placeholder="Select Pin Type"
                  filterable
                >
                  <el-option
                    v-for="(type, index) in pin_types"
                    :key="index"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.pin_type === 'student'"
              cols="12"
            >
              <b-form-group
                label="Quantity to Generate"
              >
                <el-input-number
                  v-model="form.quantity"
                  style="width: 100%;"
                  placeholder="Quantity to be generated"
                  :min="1"
                  :max="100"
                  :step="5"
                />
                <!-- <el-select
                  v-model="form.quantity"
                  style="width: 100%;"
                  placeholder="Quantity to be generated"
                  filterable
                >
                  <el-option
                    v-for="(quantity, index) in 10"
                    :key="index"
                    :label="quantity"
                    :value="quantity"
                  />
                </el-select> -->
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
    prop: 'isCreatePinSidebarActive',
    event: 'update:is-create-pin-sidebar-active',
  },
  props: {
    isCreatePinSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        quantity: 1,
        pin_type: 'student',
      },
      pin_types: [
        { value: 'student', label: 'Personal PIN for New Students' },
        { value: 'general_student', label: 'General PIN for Returning Students' },
        { value: 'staff', label: 'General PIN for Staff' },
      ],
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumClasss()
  },
  methods: {
    submit() {
      const app = this
      const generatePinResource = new Resource('school-setup/store-pins')
      const param = app.form
      app.load = true
      generatePinResource.store(param)
        .then(() => {
          app.$message('PINs Generated Successfully')
          // app.$emit('save', response.class_teachers)
          app.$emit('update:is-create-pin-sidebar-active', false)
          app.load = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
