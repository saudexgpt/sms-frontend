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
    <!-- <label>Percentage Completion</label>
    <b-progress
      :value="percentageProgress"
      max="100"
      :class="'progress-bar'+status"
      :variant="status"
    >
      <b-progress-bar :value="percentageProgress">
        <strong>{{ percentageProgress+'%' }}</strong>
      </b-progress-bar>
    </b-progress> -->

    <v-client-table
      :data="studentData.students"
      :columns="columns"
      :options="options"
    >
      <!-- <template
        slot="student"
        slot-scope="props"
      >
        {{ props.row.user.first_name + ' ' + props.row.user.last_name }}
      </template> -->
      <template
        slot="student"
        slot-scope="props"
        aria-sort="ascending"
      >
        <div align="center">
          <b-avatar
            :src="baseServerUrl +'storage/'+props.row.user.photo"
            variant="light-primary"
            :text="avatarText(props.row.user.first_name +' ' + props.row.user.last_name)"
            size="30px"
            rounded
          />
          <br>
          <small>{{ props.row.user.first_name + ' ' + props.row.user.last_name }}</small>
          <br>
          <small>{{ props.row.registration_no }}</small>
        </div>
      </template>
      <!-- <template
        slot="id"
        slot-scope="props"
      >
        {{ props.row.registration_no }}
      </template> -->
      <template
        slot="mid_term"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.mid_term }}
        </div>
      </template>
      <template
        slot="mid_term"
        slot-scope="props"
      >
        <div v-if="studentData.edit_midterm">
          <select
            v-model="props.row.result_detail.mid_term"
            style="width: 100%"
            @change="recordResult('mid_term',props.row.result_detail.mid_term, props.row.id,'test')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in setScoreRange(studentData.result_settings.mid_term)"
              :key="grade"
              :value="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.mid_term }}
        </div>
      </template>
      <template
        slot="ca1"
        slot-scope="props"
      >
        <div v-if="studentData.edit_midterm">
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
              v-for="grade in setScoreRange(studentData.result_settings.ca1)"
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
        <div v-if="studentData.edit_midterm">
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
              v-for="grade in setScoreRange(studentData.result_settings.ca2)"
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
        slot="ca3"
        slot-scope="props"
      >
        <div v-if="studentData.edit_midterm">
          <select
            v-model="props.row.result_detail.ca3"
            style="width: 100%"
            @change="recordResult('ca3',props.row.result_detail.ca3, props.row.id,'test')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in setScoreRange(studentData.result_settings.ca3)"
              :key="grade"
              :value="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.ca3 }}
        </div>
      </template>
      <template
        slot="ca4"
        slot-scope="props"
      >
        <div v-if="studentData.edit_midterm">
          <select
            v-model="props.row.result_detail.ca4"
            style="width: 100%"
            @change="recordResult('ca4',props.row.result_detail.ca4, props.row.id,'test')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in setScoreRange(studentData.result_settings.ca4)"
              :key="grade"
              :value="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.ca4 }}
        </div>
      </template>
      <template
        slot="ca5"
        slot-scope="props"
      >
        <div v-if="studentData.edit_midterm">
          <select
            v-model="props.row.result_detail.ca5"
            style="width: 100%"
            @change="recordResult('ca5',props.row.result_detail.ca5, props.row.id,'test')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in setScoreRange(studentData.result_settings.ca5)"
              :key="grade"
              :value="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.ca5 }}
        </div>
      </template>
      <template
        slot="total"
        slot-scope="props"
      >
        {{ calculateTotal(props.row.result_detail) }}
      </template>
      <template
        slot="effort"
        slot-scope="props"
      >
        <div v-if="studentData.edit_midterm">
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
        <div v-if="studentData.edit_midterm">
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
import { BAvatar } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { avatarText } from '@core/utils/filter'
import Resource from '@/api/resource'

const recordStudentResult = new Resource('result/record-result')

export default {
  components: { BAvatar },
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
      columns: ['student'],
      options: {
        headings: {
          mid_term: 'Mid Term (100%)',
          ca1: `C.A 1 (${this.studentData.result_settings.ca1}%)`,
          ca2: `C.A 2 (${this.studentData.result_settings.ca2}%)`,
          ca3: `C.A 3 (${this.studentData.result_settings.ca3}%)`,
          ca4: `C.A 4 (${this.studentData.result_settings.ca4}%)`,
          ca5: `C.A 5 (${this.studentData.result_settings.ca5}%)`,
          total: 'Total',
          effort: 'Academic Effort',
          behavior: 'Class Behavior',

        },
        sortable: ['registration_no', 'user.first_name', 'user.last_name'],
        filterable: ['registration_no', 'user.first_name', 'user.last_name'],
      },
      score_range: [],
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
    app.setMidTermAssessmentFields()
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
    setScoreRange(value) {
      const scoreRange = []

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= value; index++) {
        scoreRange.unshift(index)
      }
      return scoreRange
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
      const { result_settings } = app.studentData
      // eslint-disable-next-line radix
      const noOfMidtermCa = parseInt(result_settings.no_of_ca_for_midterm)
      app.percentageProgress = 0
      const emptyRecord = data.subject_teacher.empty_half_record
      const totalEntryToMake = data.students.length * (noOfMidtermCa + 2) // i.e mid_term, effort, behavior entries for each student
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
    calculateTotal(resultDetail) {
      const app = this
      const { result_settings } = app.studentData
      const noOfMidtermCa = result_settings.no_of_ca_for_midterm
      let total = 0
      // eslint-disable-next-line no-plusplus
      for (let index = 1; index <= noOfMidtermCa; index++) {
        const resultField = `ca${index}`
        total += resultDetail[resultField]
      }
      return total
    },
    setMidTermAssessmentFields() {
      const app = this
      const { result_settings } = app.studentData
      const noOfMidtermCa = result_settings.no_of_ca_for_midterm
      if (noOfMidtermCa > 1) {
        // eslint-disable-next-line no-plusplus
        for (let index = 1; index <= noOfMidtermCa; index++) {
          app.columns.push(`ca${index}`)
        }
        app.columns.push('total')
      } else {
        app.columns.push('mid_term')
      }
      app.columns.push('effort')
      app.columns.push('behavior')
    },

  },

}
</script>
<style scoped>
.form-control {
  width: 100%;
}
</style>
