<template>
  <el-card
    v-loading="loading"
    class="box-card"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <h3>List of Borrowed Books</h3>
    </div>
    <v-client-table
      v-model="borrowed_books"
      :columns="columns"
      :options="options"
    >
      <template
        slot="processor"
        slot-scope="{ row }"
      >
        {{ (row.processor) ? row.processor.first_name + ' ' + row.processor.last_name : '' }}
      </template>
    </v-client-table>
  </el-card>
</template>

<script>
import moment from 'moment'
import Resource from '@/api/resource'

export default {
  name: 'ManageUsers',
  components: { },
  // directives: { permission },
  props: {
    canAddNew: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      borrowed_books: [],
      columns: ['library_book.title', 'library_book.category.name', 'date_borrowed', 'due_date', 'date_returned', 'is_returned', 'processor'],
      options: {
        headings: {
          'library_book.title': 'Book Title',
          'library_book.category.name': 'Category',
          date_borrowed: 'Date',
          processor: 'Lender',
          is_returned: 'Is Returned',
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
        filterByColumn: true,
        sortable: ['date_borrowed'],
        filterable: ['library_book.title', 'date_borrowed'],
      },
      loading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    moment,
    getList() {
      const borrowedBooksResources = new Resource('library/borrow')
      this.loading = true
      borrowedBooksResources
        .list()
        .then(response => {
          this.borrowed_books = response.borrowed_books
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
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
