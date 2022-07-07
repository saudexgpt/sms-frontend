<template>
  <div v-if="studentData.students">
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
      <template
        slot="ca1"
        slot-scope="props"
      >
        <div v-if="studentData.edit_exam && studentData.result_settings.no_of_ca_for_midterm < 1">
          <select
            v-model="props.row.result_detail.ca1"

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
        <div v-if="studentData.edit_exam && studentData.result_settings.no_of_ca_for_midterm < 2">
          <select
            v-model="props.row.result_detail.ca2"

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
        <div v-if="studentData.edit_exam && studentData.result_settings.no_of_ca_for_midterm < 3">
          <select
            v-model="props.row.result_detail.ca3"

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
        <div v-if="studentData.edit_exam && studentData.result_settings.no_of_ca_for_midterm < 4">
          <select
            v-model="props.row.result_detail.ca4"

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
        <div v-if="studentData.edit_exam && studentData.result_settings.no_of_ca_for_midterm < 5">
          <select
            v-model="props.row.result_detail.ca5"

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
        slot="exam"
        slot-scope="props"
      >
        <div v-if="studentData.edit_exam">
          <select
            v-model="props.row.result_detail.exam"

            @change="recordResult('exam',props.row.result_detail.exam, props.row.id,'exam')"
          >
            <option
              value=""
              disabled
            >
              Select Score
            </option>
            <option
              v-for="grade in setScoreRange((studentData.result_settings.display_exam_score_only_for_full_term === 'no') ? studentData.result_settings.exam : 100)"
              :key="grade"
            >
              {{ grade }}
            </option>
          </select>
        </div>
        <div v-else>
          {{ props.row.result_detail.exam }}
        </div>
      </template>
      <template
        slot="total"
        slot-scope="props"
      >
        <span :id="props.row.result_detail.id">
          {{ props.row.result_detail.total }}
        </span>
      </template>
      <template
        slot="comments"
        slot-scope="props"
      >
        <div v-if="studentData.edit_exam">
          <textarea
            :id="'comment_text_'+props.row.result_detail.id"
            v-model="props.row.result_detail.comments"
            placeholder="Give remark here..."
            @blur="recordResult('comments',props.row.result_detail.comments, props.row.id,'comment')"
          />
        </div>
        <div v-else>
          {{ props.row.result_detail.comments }}
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
          photo: 'Photo',
          id: 'ID',
          name: 'Name',
          // ca1: `1st C.A (${this.studentData.result_settings.ca1}%)`,
          // ca2: `2nd C.A (${this.studentData.result_settings.ca2}%)`,
          // ca3: `3rd C.A (${this.studentData.result_settings.ca3}%)`,
          // ca4: `4th C.A (${this.studentData.result_settings.ca4}%)`,
          // ca5: `5th C.A (${this.studentData.result_settings.ca5}%)`,
          ca1: `C.A 1 (${this.studentData.result_settings.ca1}%)`,
          ca2: `C.A 2 (${this.studentData.result_settings.ca2}%)`,
          ca3: `C.A 3 (${this.studentData.result_settings.ca3}%)`,
          ca4: `C.A 4 (${this.studentData.result_settings.ca4}%)`,
          ca5: `C.A 5 (${this.studentData.result_settings.ca5}%)`,
          exam: `Exam (${(this.studentData.result_settings.display_exam_score_only_for_full_term === 'no') ? this.studentData.result_settings.exam : 100}%)`,
          total: 'Total (100%)',
          comments: 'Remark',
        },
        sortable: ['id', 'user.first_name', 'user.last_name', 'total'],
        filterable: ['id', 'user.first_name', 'user.last_name', 'total'],

      },
      over_10: [],
      over_20: [],
      over_60: [],
      percentageProgress: 0,
      status: 'progress-bar progress-bar-red',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    const app = this
    app.setScoreRange()
    app.calculateProgress(app.studentData)
    app.setFullTermAssessmentFields()
  },
  methods: {
    avatarText,
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

          const resultId = response.student_result_detail.id
          const { total } = response.student_result_detail
          const comment = response.student_result_detail.comments
          document.getElementById(resultId).innerHTML = total
          document.getElementById(`comment_text_${resultId}`).innerHTML = comment
        })
        .catch(error => {
          console.log(error)
        })
    },

    calculateProgress(data) {
      const app = this
      app.percentageProgress = 0
      const emptyRecord = data.subject_teacher.empty_full_record
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
    setScoreRange(value) {
      const scoreRange = []

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= value; index++) {
        scoreRange.unshift(index)
      }
      return scoreRange
    },
    setFullTermAssessmentFields() {
      const app = this
      const { result_settings } = app.studentData
      const displayExamScorOnlyForFullTerm = result_settings.display_exam_score_only_for_full_term
      const noOfCa = result_settings.no_of_ca
      // eslint-disable-next-line no-plusplus
      for (let index = 1; index <= noOfCa; index++) {
        if (displayExamScorOnlyForFullTerm === 'no') {
          app.columns.push(`ca${index}`)
        }
      }
      app.columns.push('exam')
      app.columns.push('total')
      // app.columns.push('comments')
    },

  },

}
</script>
<style scoped>
.form-control {
  width: 100%;
}
</style>
