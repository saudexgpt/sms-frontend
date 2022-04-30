<template>
  <div>

    <el-card
      v-loading="load_table"
      class="box-card"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>Library Books Categories</span>
        <span class="pull-right">
          <el-button
            class="filter-item"
            type="success"
            icon="el-icon-plus"
            @click="isCreateCategorySidebarActive = true"
          >Add Category
          </el-button>
        </span>
      </div>
      <v-client-table
        v-model="categories"
        :columns="columns"
        :options="options"
      >
        <template
          slot="action"
          slot-scope="{row}"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="Edit"
            placement="top-start"
          >
            <el-button
              round
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editRow(row)"
            />
          </el-tooltip>
        </template>
      </v-client-table>
      <add-category
        v-if="isCreateCategorySidebarActive"
        v-model="isCreateCategorySidebarActive"
        @save="fetchCategories"
      />
      <edit-category
        v-if="isEditCategorySidebarActive"
        v-model="isEditCategorySidebarActive"
        :selected-category="selected_category"
        @update="fetchCategories"
      />
    </el-card>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import AddCategory from './partials/AddCategory.vue'
import EditCategory from './partials/EditCategory.vue'

export default {
  name: 'ManageUsers',
  components: { AddCategory, EditCategory },
  // directives: { permission },
  props: {
    canAddNew: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      categories: [],
      columns: [
        'name', 'level_group.name', 'description', 'action',
      ],

      options: {
        headings: {
          action: '',
          'level_group.name': 'Level Group',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        // texts: {
        //   filter: 'Search:',
        // },
        // editableColumns:['name', 'category.name', 'sku'],
        sortable: ['name', 'level_group.name'],
        filterable: ['name', 'level_group.name'],
      },
      total: 0,
      load_table: false,
      isCreateCategorySidebarActive: false,
      isEditCategorySidebarActive: false,
      selected_category: '',
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    fetchCategories() {
      const app = this
      app.load_table = true
      const categoriesResource = new Resource('library/books/category')
      categoriesResource.list().then(response => {
        app.categories = response.book_categories
        app.load_table = false
      })
    },
    editRow(row) {
      this.selected_category = row
      this.isEditCategorySidebarActive = true
    },
  },
}
</script>
<style>
.vs-con-input {
    margin-top: 20px !important ;
}
.dialog-footer {
    background: #f0f0f0;
    padding: 10px;
    margin-top: 20px !important ;
    position: relative;
}
</style>
