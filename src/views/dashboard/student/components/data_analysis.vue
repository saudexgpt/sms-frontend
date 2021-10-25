<template>
  <div
    v-if="student"
  >
    <el-row
      :gutter="10"
    >
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <analytics-congratulation
          :data="student.user"
          :current-class="current_class"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <statistic-card-with-area-chart
          icon="ActivityIcon"
          :statistic="average_performance + '%'"
          statistic-title="My Performance"
          :chart-data="series"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <statistic-card-horizontal
          color="warning"
          icon="UsersIcon"
          :statistic="total_in_class"
          statistic-title="Total in Class"
        />
        <statistic-card-horizontal
          color="primary"
          icon="BookIcon"
          :statistic="subject_teachers.length"
          statistic-title="No. of Subjects"
        />
      </el-col>
      <!-- <el-col
        :xs="12"
        :sm="12"
        :md="10"
        :lg="10"
        :xl="10"
      >
        <statistic-card-horizontal
          color="success"
          icon="UsersIcon"
          :statistic="10"
          statistic-title="My Teachers"
        />
      </el-col> -->
      <!-- <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <router-link :to="{name: 'MyResult'}">
          <statistic-card-horizontal
            icon="BarChartIcon"
            statistic="100%"
            statistic-title="My Result"
          />
        </router-link>
      </el-col> -->
    </el-row>

    <el-row :gutter="10">
      <el-col
        :lg="12"
        :xl="12"
        :md="12"
        :sm="12"
        :xs="24"
      >
        <b-card
          v-if="class_teacher !== ''"
          :img-src="require('@/assets/images/banner/banner-2.jpg')"
          img-alt="Profile Cover Photo"
          img-top
          class="card-profile"
        >
          <div class="profile-image-wrapper">
            <div class="profile-image p-0">
              <b-avatar
                size="114"
                variant="light"
                :src="baseServerUrl +'storage/'+class_teacher.photo"
              />
            </div>
          </div>
          <h3>{{ class_teacher.first_name + ' ' + class_teacher.last_name }}</h3>
          <h6 class="text-muted">
            {{ class_teacher.email }}
          </h6>
          <b-badge
            class="profile-badge"
            variant="light-primary"
          >
            Class Teacher
          </b-badge>
          <hr class="mb-2">
        </b-card>
        <b-card>
          <div slot="header">
            <h4>My Subjects</h4>
          </div>

          <v-client-table
            v-model="subject_teachers"
            :columns="columns"
            :options="options"
          >
            <div
              slot="sn"
              slot-scope="props"
            >
              {{ props.index }}
            </div>
          </v-client-table>
        </b-card>
        <student-routine />
      </el-col>

      <el-col
        :lg="12"
        :xl="12"
        :md="12"
        :sm="12"
        :xs="24"
      >
        <timeline />
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10">
      <el-col
        :lg="6"
        :xl="6"
        :md="6"
        :sm="24"
        :xs="24"
      >
        <student-routine />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { BCard, BAvatar, BBadge } from 'bootstrap-vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import StatisticCardWithAreaChart from '@core/components/statistics-cards/StatisticCardWithAreaChart.vue'
// import StudentDetails from '@/views/modules/user/students/partials/Details.vue'
import StudentRoutine from '@/views/modules/time-table/StudentRoutine.vue'
import Timeline from '@/views/modules/user/Timeline.vue'
import AnalyticsCongratulation from '@/views/dashboard/analytics/AnalyticsCongratulation.vue'
import Resource from '@/api/resource'

const dataAnalysisResource = new Resource('dashboard/student')
export default {

  components: {
    BCard, BAvatar, BBadge, StatisticCardHorizontal, StatisticCardWithAreaChart, /* StudentDetails, */ StudentRoutine, AnalyticsCongratulation, Timeline,
  },

  data() {
    return {
      role: 'student',

      student: '',
      subject_teachers: [],
      total_in_class: 0,
      current_class: '',
      class_teacher: '',
      series: [
        {
          name: 'Performance',
          data: [],
        },
      ],
      average_performance: 0,
      columns: [
        'sn',
        'subject.name',
      ],

      options: {
        headings: {
          'subject.name': 'Subject',
          sn: '#',
        },
        sortable: [
          'id',
          'subject.name',
        ],
        // filterable: false,
        filterable: [
          'id',
          'subject.name',
        ],
      },
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchData()
  },
  methods: {

    fetchData() {
      const app = this
      // this.listLoading = true;
      dataAnalysisResource.list()
        .then(response => {
          app.student = response.student
          app.subject_teachers = response.subject_teachers
          app.series[0].data = response.performance_data
          app.average_performance = response.average_performance
          app.total_in_class = response.total_in_class
          app.current_class = response.current_class
          app.class_teacher = response.class_teacher
        })
    },
  },
}
</script>
