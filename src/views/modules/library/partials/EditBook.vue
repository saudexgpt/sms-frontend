<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditBookSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-book-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Book
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
                label="Select Book Category"
              >
                <el-select
                  v-model="selected_category_index"
                  placeholder="Select Category"
                  clearable
                  style="width: 100%"
                  class="filter-item"
                  @input="setCategory()"
                >
                  <el-option
                    v-for="(category, index) in categories"
                    :key="index"
                    :label="category.name"
                    :value="index"
                  >
                    <span style="float: left">{{ category.name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >&nbsp;({{ (category.level_group) ? category.level_group.name : 'No specific level' }})</span>

                  </el-option>
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Book Title"
                label-for="v-book_title"
              >
                <b-form-input
                  v-model="form.title"
                  placeholder="Enter Book Title..."
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="ISBN"
                label-for="v-isbn"
              >
                <b-form-input
                  v-model="form.ISBN"
                  placeholder="Enter ISBN..."
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Authors (separate multiple with comma)"
                label-for="v-authors"
              >
                <b-form-input
                  v-model="form.authors"
                  placeholder="Enter Authors..."
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Serial No."
                label-for="v-serial_no"
              >
                <b-form-input
                  v-model="form.serial_no"
                  placeholder="Enter Book Serial No..."
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Publisher"
                label-for="v-publisher"
              >
                <b-form-input
                  v-model="form.publisher"
                  placeholder="Enter Publisher"
                />
              </b-form-group>
            </b-col>
            <!-- Book Name -->
            <b-col cols="12">
              <b-form-group
                label="Shelf Quantity"
                label-for="v-quantity"
              >
                <el-input-number
                  v-model="form.quantity"
                  placeholder="Enter Quantity in Shelf..."
                />
              </b-form-group>
            </b-col>
            <!-- Abbrev -->
            <b-col cols="12">
              <b-form-group
                label="Copyright Year"
                label-for="v-copyright_year"
              >
                <el-date-picker
                  v-model="form.copyright_year"
                  type="year"
                  placeholder="Pick a year"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Extra Note"
                label-for="v-description"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Enter extra description of the book"
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
    prop: 'isEditBookSidebarActive',
    event: 'update:is-edit-book-sidebar-active',
  },
  props: {
    isEditBookSidebarActive: {
      type: Boolean,
      required: true,
    },
    categories: {
      type: Array,
      default: () => ([]),
    },
    selectedBook: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        library_book_category_id: '',
        curriculum_level_group_id: null,
        ISBN: '',
        title: '',
        authors: '',
        serial_no: '',
        publisher: '',
        quantity: 1,
        description: '',
      },
      loading: false,
      error: false,
      selected_category_index: '',
    }
  },
  created() {
    this.form = this.selectedBook
  },
  methods: {
    setCategory() {
      const app = this
      const category = app.categories[app.selected_category_index]
      app.form.library_book_category_id = category.id
      app.form.curriculum_level_group_id = category.curriculum_level_group_id
    },
    update() {
      const app = this
      const saveBookResource = new Resource('library/books/update')
      const param = app.form
      if (param.ISBN === '' || param.title === '') {
        app.$alert('The ISBN and Title fields are mandatory')
      } else {
        app.loading = true
        saveBookResource.update(param.id, param)
          .then(response => {
            app.loading = false
            this.$message({
              type: 'success',
              message: 'Book Updated Successfully',
            })
            app.$emit('update', response)
            app.$emit('update:is-edit-book-sidebar-active', false)
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
