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
        <span>List of Library Books</span>
        <span class="pull-right">
          <el-button
            class="filter-item"
            type="success"
            icon="el-icon-plus"
            @click="isCreateBookSidebarActive = true"
          >Add New Book
          </el-button>
        </span>
      </div>
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <el-input
              v-model="query.keyword"
              placeholder="Search User"
              style="width: 200px"
              class="filter-item"
              @input="handleFilter"
            />
            <el-select
              v-model="query.category_id"
              placeholder="Filter By Category"
              clearable
              style="width: 50%"
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <strong>Click on the <code>+</code> sign to view borrowers</strong>
      </div>
      <v-client-table
        v-model="books"
        :columns="columns"
        :options="options"
      >
        <div
          slot="child_row"
          slot-scope="props"
        >
          <aside>
            <legend>Borrowers of <strong>{{ props.row.title }}</strong></legend>

            <v-client-table
              v-model="props.row.borrowed_books"
              :columns="borrowedColumns"
              :options="borrowedOptions"
            >

              <template
                slot="borrower"
                slot-scope="{ row }"
              >
                {{ (row.borrower) ? row.borrower.first_name + ' ' + row.borrower.last_name : '' }}
              </template>
              <template
                slot="processor"
                slot-scope="{ row }"
              >
                {{ (row.processor) ? row.processor.first_name + ' ' + row.processor.last_name : '' }}
              </template>
              <template
                slot="receiver"
                slot-scope="{ row }"
              >
                {{ (row.receiver) ? row.receiver.first_name + ' ' + row.receiver.last_name : '' }}
              </template>
              <template
                slot="action"
                slot-scope="{ row }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Return Book"
                  placement="bottom-start"
                >
                  <el-button
                    round
                    type="primary"
                    size="small"
                    icon="el-icon-check"
                    @click="returnBook(row)"
                  />
                </el-tooltip>
              </template>
            </v-client-table>
          </aside>
        </div>
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
          {{ row.recorded_by.first_name + ' ' + row.recorded_by.last_name }}
        </template>
        <template
          slot="action"
          slot-scope="{row}"
        >
          <span>

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
            <br>
            <el-tooltip
              v-if="availableQuantity(row) > 0"
              class="item"
              effect="dark"
              content="Lend Book"
              placement="bottom-start"
            >
              <el-button
                v-if="availableQuantity(row) > 0"
                round
                type="danger"
                size="small"
                icon="el-icon-notebook-1"
                @click="lendBook(row)"
              />
            </el-tooltip>
          </span>
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
      <add-book
        v-if="isCreateBookSidebarActive"
        v-model="isCreateBookSidebarActive"
        :categories="categories"
        @save="getList"
      />
      <edit-book
        v-if="isEditBookSidebarActive"
        v-model="isEditBookSidebarActive"
        :categories="categories"
        :selected-book="selected_book"
        @update="getList"
      />
      <lend-book
        v-if="isBorrowBookSidebarActive"
        v-model="isBorrowBookSidebarActive"
        :users="users"
        :selected-book="selected_book"
        @save="getList"
      />
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/views/components/Pagination-main/index.vue' // Secondary package based on el-pagination
import Resource from '@/api/resource'
import AddBook from './partials/AddBook.vue'
import EditBook from './partials/EditBook.vue'
import LendBook from './partials/LendBook.vue'

export default {
  name: 'ManageUsers',
  components: {
    Pagination, AddBook, EditBook, LendBook,
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
        'action', 'title', 'category.name', 'ISBN', 'authors', 'serial_no', 'publisher', 'copyright_year', 'quantity', 'available', 'recorded_by',
      ],

      options: {
        headings: {
          'category.name': 'Category',
          recorded_by: 'Recorded By',
          quantity: 'Stocked Quantity',
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
        filterable: ['ISBN', 'title', 'authors', 'copyright_year'],
      },
      borrowedColumns: ['action', 'borrower', 'date_borrowed', 'due_date', 'date_returned', 'is_returned', 'processor', 'receiver'],
      borrowedOptions: {
        headings: {
          date_borrowed: 'Date',
          processor: 'Lender',
          is_returned: 'Is Returned',
          action: '',
        },
        rowAttributesCallback(row) {
          const todayDate = new Date()
          const dueDate = new Date(row.due_date)
          if (dueDate < todayDate) {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          // if (row.student.studentship_status === 'graduated') {
          //   return { style: 'background: #6610f2; color: #ffffff' }
          // }
          return { style: 'background: #36c15ecf; color: #000000' }
        },
        sortable: ['date_borrowed'],
      },
      total: 0,
      loading: false,
      load_table: false,
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        category_id: '',
      },
      isCreateBookSidebarActive: false,
      isEditBookSidebarActive: false,
      isBorrowBookSidebarActive: false,
      selected_book: '',
    }
  },
  created() {
    this.fetchUsers()
    this.getList(true)
    this.fetchCategories()
  },
  methods: {
    moment,
    fetchUsers() {
      const app = this

      const usersResource = new Resource('schools/fetch-commumity')
      usersResource.list().then(response => {
        app.users = response.users
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
    editRow(row) {
      this.selected_book = row
      this.isEditBookSidebarActive = true
    },
    lendBook(row) {
      this.selected_book = row
      this.isBorrowBookSidebarActive = true
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
    returnBook(row) {
      this.$confirm('Click OK to confirm return', 'Confirm Return', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'success',
      }).then(() => {
        const returnBookResources = new Resource('library/borrow/return-book')
        returnBookResources
          .update(row.id)
          .then(() => {
            this.getList()
            this.$message({
              type: 'success',
              message: 'Book is returned successfully',
            })
          })
      })
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
