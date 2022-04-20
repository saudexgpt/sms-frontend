<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isBorrowBookSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-borrow-book-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Lend <strong>{{ selectedBook.title }}</strong>
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
                label="Select Borrower"
              >
                <el-select
                  v-model="form.borrower_id"
                  placeholder="Select Borrower"
                  filterable
                  style="width: 100%"
                  class="filter-item"
                >
                  <el-option
                    v-for="(entry, index) in users"
                    :key="index"
                    :label="entry.user.first_name + ' ' + entry.user.last_name + ' (' + entry.user.username + ')'"
                    :value="entry.user_id"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Date Borrowed"
                label-for="v-date_borrowed"
              >
                <el-date-picker
                  v-model="form.date_borrowed"
                  type="date"
                  placeholder="Pick a date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="datePickerOptions1"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Return Due Date"
                label-for="v-due_date"
              >
                <el-date-picker
                  v-model="form.due_date"
                  type="date"
                  placeholder="Pick a date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="datePickerOptions2"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <!-- Book Name -->
            <!-- <b-col cols="12">
              <b-form-group
                label="Quantity Borrowed"
                label-for="v-quantity"
              >
                <el-input-number
                  v-model="form.quantity"
                  placeholder="Enter Quantity..."
                />
              </b-form-group>
            </b-col> -->
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
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
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
    prop: 'isBorrowBookSidebarActive',
    event: 'update:is-borrow-book-sidebar-active',
  },
  props: {
    isBorrowBookSidebarActive: {
      type: Boolean,
      required: true,
    },
    users: {
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
      datePickerOptions1: {

        // eslint-disable-next-line consistent-return
        disabledDate(date) {
          if (date > new Date()) {
            return true
          }
        },
      },
      datePickerOptions2: {

        // eslint-disable-next-line consistent-return
        disabledDate(date) {
          if (date < new Date()) {
            return true
          }
        },
      },
      form: {
        borrower_id: '',
        date_borrowed: '',
        due_date: '',
        quantity: 1,
        library_book_id: '',
      },
      loading: false,
      error: false,
    }
  },
  created() {
    this.form.library_book_id = this.selectedBook.id
  },
  methods: {
    submit() {
      const app = this
      const saveBorrowingResource = new Resource('library/borrow/new-borrowing')
      const param = app.form
      if (param.borrower_id === '' || param.date_borrowed === '' || param.due_date === '') {
        app.$alert('All fields are mandatory')
      } else {
        app.loading = true
        saveBorrowingResource.store(param)
          .then(response => {
            app.loading = false
            this.$message({
              type: 'success',
              message: 'Book Borrowed Successfully',
            })
            app.$emit('save', response)
            app.$emit('update:is-borrow-book-sidebar-active', false)
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
