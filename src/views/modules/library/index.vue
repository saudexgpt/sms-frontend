<template>
  <div>
    <el-row
      v-if="libraryData !== ''"
      :gutter="8"
    >
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <statistic-card-horizontal
          color="white"
          bg="primary"
          icon="LayersIcon"
          :statistic="libraryData.books.total_quantity"
          statistic-title="No. of Books"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <statistic-card-horizontal
          color="white"
          bg="warning"
          icon="LayersIcon"
          :statistic="libraryData.categories"
          statistic-title="Book Categories"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <statistic-card-horizontal
          color="white"
          bg="success"
          icon="BookIcon"
          :statistic="libraryData.borrowed"
          statistic-title="Borrowed Books"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
      >
        <statistic-card-horizontal
          color="white"
          bg="danger"
          icon="BookIcon"
          :statistic="libraryData.overdue_borrowed"
          statistic-title="Overdue Borrowed"
        />
      </el-col>
    </el-row>
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        label="Library Books"
        name="books"
      >
        <books v-if="activeName === 'books'" />
      </el-tab-pane>
      <el-tab-pane
        label="Book Category"
        name="category"
      >
        <book-category />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import Books from './Books.vue'
import BookCategory from './BookCategory.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Books, BookCategory, StatisticCardHorizontal,
  },
  data() {
    return {
      activeName: 'books',
      libraryData: '',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const app = this

      const usersResource = new Resource('library/fetch-data')
      usersResource.list().then(response => {
        app.libraryData = response
      })
    },
  },
}
</script>
