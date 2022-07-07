<template>
  <div>

    <v-client-table
      :data="students"
      :columns="columns"
      :options="options"
    >
      <!-- <template
        slot="name"
        slot-scope="props"
        aria-sort="ascending"
      >
        {{ props.row.user.last_name }}, {{ props.row.user.first_name }}
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
            :text="avatarText(props.row.user.last_name +' ' + props.row.user.first_name)"
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
        slot="midterm_to_ca"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.midterm_to_ca }}
        </div>
      </template>
      <template
        slot="attendance_score"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.attendance_score }}
        </div>
      </template>
      <template
        slot="ca1"
        slot-scope="props"
      >
        {{ props.row.result_detail.ca1 }}

      </template>
      <template
        slot="ca2"
        slot-scope="props"
      >
        {{ props.row.result_detail.ca2 }}
      </template>
      <template
        slot="ca3"
        slot-scope="props"
      >

        {{ props.row.result_detail.ca3 }}

      </template>
      <template
        slot="ca4"
        slot-scope="props"
      >
        {{ props.row.result_detail.ca4 }}
      </template>
      <template
        slot="ca5"
        slot-scope="props"
      >

        {{ props.row.result_detail.ca5 }}

      </template>
      <template
        slot="exam"
        slot-scope="props"
      >

        {{ props.row.result_detail.exam }}

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

        {{ props.row.result_detail.comments }}

      </template>

    </v-client-table>

  </div>
</template>
<script>
import { BAvatar } from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
// import Resource from '@/api/resource'

// const recordStudentResult = new Resource('result/record-result')
export default {
  components: { BAvatar },
  props: {
    students: {
      type: Array,
      default: () => ({}),
    },
    resultSettings: {
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
          midterm_to_ca: `Midterm (${this.resultSettings.midterm_score_limit}%)`,
          attendance_score: `Attendance (${this.resultSettings.attendance_score_limit}%)`,
          ca1: `C.A 1 (${this.resultSettings.ca1}%)`,
          ca2: `C.A 2 (${this.resultSettings.ca2}%)`,
          ca3: `C.A 3 (${this.resultSettings.ca3}%)`,
          ca4: `C.A 4 (${this.resultSettings.ca4}%)`,
          ca5: `C.A 5 (${this.resultSettings.ca5}%)`,
          exam: `Exam (${this.resultSettings.exam}%)`,
          total: 'Total (100%)',
          comments: 'Remark',
        },
        sortable: ['id', 'registration_no', 'user.first_name', 'user.last_name', 'total'],
        filterable: ['id', 'registration_no', 'user.first_name', 'user.last_name', 'total'],

      },
      over_10: [],
      over_20: [],
      over_60: [],
      percentage_progress: 0,
      status: 'progress-bar progress-bar-red',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.setFullTermAssessmentFields()
  },
  methods: {
    avatarText,
    setFullTermAssessmentFields() {
      const app = this
      const { resultSettings } = app
      const displayExamScorOnlyForFullTerm = resultSettings.display_exam_score_only_for_full_term
      const noOfCa = resultSettings.no_of_ca
      if (resultSettings.add_midterm_score_to_full_result === 'yes') {
        app.columns.push('midterm_to_ca')
      }
      if (resultSettings.add_attendance_to_ca === 'yes') {
        app.columns.push('attendance_score')
      }
      // eslint-disable-next-line no-plusplus
      for (let index = 1; index <= noOfCa; index++) {
        if (displayExamScorOnlyForFullTerm === 'no') {
          app.columns.push(`ca${index}`)
        }
      }
      app.columns.push('exam')
      app.columns.push('total')
      app.columns.push('comments')
      // app.columns.push('comments')
    },
    // setFullTermAssessmentFields() {
    //   const app = this
    //   // const noOfMidtermCa = result_settings.no_of_ca_for_midterm
    //   const noOfCa = app.resultSettings.no_of_ca
    //   // eslint-disable-next-line no-plusplus
    //   for (let index = 1; index <= noOfCa; index++) {
    //     // if (index > noOfMidtermCa) {
    //     app.columns.push(`ca${index}`)
    //     // }
    //   }
    //   app.columns.push('exam')
    //   app.columns.push('total')
    //   app.columns.push('comments')
    // },
  },

}
</script>
