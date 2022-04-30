<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditCategorySidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-category-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Book Category
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
            <b-col cols="12">
              <b-form-group
                label="Select Level Group"
                label-for="v-curriculum"
              >
                <el-select
                  v-model="form.curriculum_level_group_id"
                  placeholder="Select Level Group"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(curriculum_level_group, index) in curriculum_level_groups"
                    :key="index"
                    :value="curriculum_level_group.id"
                    :label="curriculum_level_group.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group
                label="Category Name"
                label-for="v-name"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Enter Category Name..."
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Description"
                label-for="v-description"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Enter description"
                />
              </b-form-group>
            </b-col>
            <!-- update and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="update"
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
import {
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
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
    prop: 'isEditCategorySidebarActive',
    event: 'update:is-edit-category-sidebar-active',
  },
  props: {
    isEditCategorySidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedCategory: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        curriculum_level_group_id: '',
        name: '',
        description: '',
      },
      curriculum_level_groups: [],
      loading: false,
      error: false,
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
          app.form = app.selectedCategory
        })
    },
    update() {
      const app = this
      const updateCategoryResource = new Resource('library/books/update-category')
      const param = app.form
      if (param.name === '') {
        app.$alert('The Category Name field is mandatory')
      } else {
        app.loading = true
        updateCategoryResource.update(param.id, param)
          .then(response => {
            app.loading = false
            this.$message({
              type: 'success',
              message: 'Category Updated Successfully',
            })
            app.$emit('update', response)
            app.$emit('update:is-edit-category-sidebar-active', false)
          }).catch(error => {
            app.error = true
            app.error_message = error
            app.loading = false
          })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
