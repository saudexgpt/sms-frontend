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
        <span>List of Available Books</span>
      </div>
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
          >
            <el-input
              v-model="query.keyword"
              placeholder="Search Book"
              style="width: 200px"
              class="filter-item"
              @input="handleFilter"
            />
            <el-select
              v-model="query.category_id"
              placeholder="Filter By Category"
              clearable
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              >
                <span style="float: left">{{ category.name }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px"
                >&nbsp;({{ (category.level_group) ? category.level_group.name : 'No specific level' }})</span>

              </el-option>
            </el-select>
            <el-select
              v-if="!checkRole(['student'])"
              v-model="query.curriculum_level_group_id"
              placeholder="Filter By Level Group"
              clearable
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="(curriculum_level_group, index) in curriculum_level_groups"
                :key="index"
                :value="curriculum_level_group.id"
                :label="curriculum_level_group.name"
              />
            </el-select>

          </el-col>
        </el-row>
      </div>
      <v-client-table
        v-model="books"
        :columns="columns"
        :options="options"
      >
        <template
          slot="available"
          slot-scope="{row}"
        >
          {{ availableQuantity(row) }}
        </template>
        <template
          slot="copyright_year"
          slot-scope="{ row }"
        >
          {{ moment(row.copyright_year).format('YYYY') }}
        </template>
        <template
          slot="recorded_by"
          slot-scope="{ row }"
        >
          {{ (row.recorded_by) ? row.recorded_by.first_name + ' ' + row.recorded_by.last_name : '' }}
        </template>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="getList"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/views/components/Pagination-main/index.vue' // Secondary package based on el-pagination
import Resource from '@/api/resource'
import checkRole from '@/utils/role'

export default {
  name: 'Books',
  components: {
    Pagination,
  },
  // directives: { permission },
  props: {
    canAddNew: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      books: [],
      categories: [],
      users: [],
      columns: [
        'title', 'available', 'level_group.name', 'category.name', 'ISBN', 'authors', 'serial_no', 'publisher', 'copyright_year', 'recorded_by',
      ],

      options: {
        headings: {
          'category.name': 'Category',
          'level_group.name': 'Level Group',
          recorded_by: 'Recorded By',
          available: 'Available Quantity',
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
        sortable: ['ISBN', 'title', 'authors', 'copyright_year'],
        filterable: [/* 'ISBN', 'title', 'authors', 'copyright_year' */],
      },
      total: 0,
      loading: false,
      load_table: false,
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        category_id: '',
        curriculum_level_group_id: '',
      },
      selected_book: '',
      curriculum_level_groups: [],
    }
  },
  created() {
    this.getList(true)
    this.fetchCategories()
    this.fetchCurriculumLevels()
  },
  methods: {
    moment,
    checkRole,
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-level-groups')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculum_level_groups = response.curriculum_level_groups
        })
    },
    fetchCategories() {
      const app = this

      const categoriesResource = new Resource('library/books/category')
      categoriesResource.list().then(response => {
        app.categories = response.book_categories
      })
    },
    getList(load) {
      const { limit, page } = this.query
      this.options.perPage = limit
      if (load) {
        this.load_table = true
      }
      const booksResources = new Resource('library/books')
      booksResources
        .list(this.query)
        .then(response => {
          this.books = response.books.data
          this.books.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign
            element.index = (page - 1) * limit + index + 1
          })
          this.total = response.books.total
          this.load_table = false
        })
        .catch(error => {
          console.log(error)
          this.load_table = false
        })
    },
    handleFilter() {
      this.query.page = 1
      this.getList(false)
    },
    availableQuantity(row) {
      const { quantity } = row
      const { borrowed_books } = row
      let quantityBorrowed = 0
      borrowed_books.forEach(element => {
        // const borrowed = element.quantity - element.quantity_returned
        if (element.is_returned === 'no') {
          quantityBorrowed += 1
        }
      })
      const available = quantity - quantityBorrowed
      return available
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
