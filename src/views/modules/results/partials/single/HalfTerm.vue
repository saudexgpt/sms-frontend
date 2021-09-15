<template>
  <div v-if="studentData.students">
    <!-- <div class="progress-group">
      <span class="progress-text">Percentage Completion: </span>
      <span class="progress-number">{{ percentageProgress+'%' }}</span>
      <div class="progress sm">
        <div
          :class="status"
          :style="'width: '+percentageProgress+'%'"
        />
      </div>
    </div> -->
    <label>Percentage Completion</label>
    <b-progress
      :value="percentageProgress"
      max="100"
      :class="'progress-bar'+status"
      :variant="status"
    >
      <b-progress-bar :value="percentageProgress">
        <strong>{{ percentageProgress+'%' }}</strong>
      </b-progress-bar>
    </b-progress>

    <v-client-table
      :data="studentData.students"
      :columns="columns"
      :options="options"
    >
      <template
        slot="name"
        slot-scope="props"
        aria-sort="ascending"
      >
        {{ props.row.user.first_name + ' ' + props.row.user.last_name }}
      </template>
      <template
        slot="photo"
        slot-scope="props"
      >
        <b-avatar
          :src="baseServerUrl +'storage/'+props.row.user.photo"
          variant="light-primary"
          :text="avatarText(props.row.user.last_name +' ' + props.row.user.first_name)"
          size="50px"
          rounded
        />
      </template>
      <template
        slot="id"
        slot-scope="props"
      >
        {{ props.row.registration_no }}
      </template>
      <template
        slot="ca1"
        slot-scope="props"
      >
        <div v-if="studentData.edit_ca1">
          <select
            v-model="props.row.result_detail.ca1"
            style="width: 100%"
            @change="recordResult('ca1',props.row.result_detail.ca1, props.row.id,'test')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in over_20"
              :key="grade"
              :value="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.ca1 }}
        </div>
      </template>
      <template
        slot="ca2"
        slot-scope="props"
      >
        <div v-if="studentData.edit_ca2">
          <select
            v-model="props.row.result_detail.ca2"
            style="width: 100%"
            @change="recordResult('ca2',props.row.result_detail.ca2, props.row.id,'test')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in over_10"
              :key="grade"
              :value="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.ca2 }}
        </div>
      </template>
      <template
        slot="effort"
        slot-scope="props"
      >
        <div v-if="studentData.edit_ca1 || studentData.edit_ca2">
          <select
            v-model="props.row.result_detail.effort"
            style="width: 100%"
            @change="recordResult('effort',props.row.result_detail.effort, props.row.id,'effort')"
          >
            <option
              value=""
              disabled
            >
              Select Rating
            </option>
            <option
              v-for="(rating, index) in ratings"
              :key="index"
              :value="rating.value"
            >
              {{ rating.label }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ getRating(props.row.result_detail.effort) }}
        </div>
      </template>
      <template
        slot="behavior"
        slot-scope="props"
      >
        <div v-if="studentData.edit_ca1 || studentData.edit_ca2">
          <select
            v-model="props.row.result_detail.behavior"
            style="width: 100%"
            @change="recordResult('behavior',props.row.result_detail.behavior, props.row.id,'behavior')"
          >
            <option
              value=""
              disabled
            >
              Select Rating
            </option>
            <option
              v-for="(rating, index) in ratings"
              :key="index"
              :value="rating.value"
            >
              {{ rating.label }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ getRating(props.row.result_detail.behavior) }}
        </div>
      </template>

    </v-client-table>
  </div>
</template>
<script>
import {
  BProgress, BProgressBar, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { avatarText } from '@core/utils/filter'
import Resource from '@/api/resource'

const recordStudentResult = new Resource('result/record-result')

export default {
  components: { BProgress, BProgressBar, BAvatar },
  directives: {
    Ripple,
  },
  props: {
    studentData: {
      type: Object,
      default: () => ({}),
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      columns: ['photo', 'id', 'name', 'ca1', 'ca2', 'effort', 'behavior'],
      options: {
        headings: {
          photo: 'Photo',
          id: 'ID',
          name: 'Name',
          ca1: '1st C.A (20%)',
          ca2: '2nd C.A (10%)',
          effort: 'Academic Effort',
          behavior: 'Class Behavior',

        },
        sortable: ['id', 'user.first_name', 'user.last_name', 'total'],
        filterable: ['id', 'user.first_name', 'user.last_name', 'total'],
      },
      over_10: [],
      over_20: [],
      ratings: [
        { value: 5, label: 'Excellent' },
        { value: 4, label: 'Very Good' },
        { value: 3, label: 'Good' },
        { value: 2, label: 'Average' },
        { value: 1, label: 'Fair' },

      ],
      percentageProgress: 0,
      status: 'danger',

    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    const app = this
    app.calculateProgress(app.studentData)
    app.setScoreRange()
  },
  methods: {
    avatarText,
    getRating(rating) {
      const app = this
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < app.ratings.length; index++) {
        const { value } = app.ratings[index]
        if (rating === value) {
          return app.ratings[index].label
        }
      }
      return null
    },
    setScoreRange() {
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= 10; index++) {
        this.over_10.unshift(index)
      }
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= 20; index++) {
        this.over_20.unshift(index)
      }
    },
    recordResult(assessment, score, studentId, action) {
      const app = this
      const { subject_teacher_id } = app.studentData
      const { sess_id } = app.form
      const { term_id } = app.form
      const { sub_term } = app.form
      const params = {
        assessment, score, student_id: studentId, action, subject_teacher_id, sess_id, term_id, sub_term,
      }
      recordStudentResult.store(params)
        .then(response => {
        // alert('saved')
          app.studentData.students = response.students
          app.studentData.subject_teacher = response.subject_teacher
          app.calculateProgress(app.studentData)
        })
        .catch(error => {
          console.log(error)
        })
    },

    calculateProgress(data) {
      const app = this
      app.percentageProgress = 0
      const emptyRecord = data.subject_teacher.empty_half_record
      const totalEntryToMake = data.students.length * 4 // i.e ca1, ca2, effort, behavior entries for each student
      const percentageProgress = 100 - (emptyRecord / totalEntryToMake) * 100
      if (percentageProgress < 40) {
        app.status = 'danger'
      } else if (percentageProgress >= 40 && percentageProgress < 60) {
        app.status = 'warning'
      } else if (percentageProgress >= 60 && percentageProgress < 99.99) {
        app.status = 'info'
      } else {
        app.status = 'success'
      }
      app.percentageProgress = Number(percentageProgress.toFixed(2))
    },

  },

}
</script>
<style scoped>
.form-control {
  width: 100%;
}
</style>
