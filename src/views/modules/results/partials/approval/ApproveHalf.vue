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
        slot="mid_term1"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.mid_term1 }}
        </div>
      </template>
      <template
        slot="mid_term2"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.mid_term2 }}
        </div>
      </template>
      <!-- <template
        slot="ca1"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.ca1 }}
        </div>
      </template>
      <template
        slot="ca2"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.ca2 }}
        </div>
      </template>
      <template
        slot="ca3"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.ca3 }}
        </div>
      </template>
      <template
        slot="ca4"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.ca4 }}
        </div>
      </template>
      <template
        slot="ca5"
        slot-scope="props"
      >
        <div>
          {{ props.row.result_detail.ca5 }}
        </div>
      </template> -->
      <template
        slot="total"
        slot-scope="props"
      >
        {{ parseInt(props.row.result_detail.mid_term1) + parseInt(props.row.result_detail.mid_term2) }}

      </template>
      <!-- <template
        slot="ca2"
        slot-scope="props"
      >

        {{ props.row.result_detail.ca2 }}

      </template> -->
      <template
        slot="effort"
        slot-scope="props"
      >

        {{ getRating(props.row.result_detail.effort) }}

      </template>
      <template
        slot="behavior"
        slot-scope="props"
      >

        {{ getRating(props.row.result_detail.behavior) }}

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
      default: () => ([]),
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
          mid_term1: `Midterm Score (${100 / this.resultSettings.no_of_ca_for_midterm}%)`,
          mid_term2: `Midterm Score 2 (${100 / this.resultSettings.no_of_ca_for_midterm}%)`,
          total: 'Total (100%)',
          effort: 'Academic Effort',
          behavior: 'Class Behavior',

        },
        sortable: ['id', 'registration_no', 'user.first_name', 'user.last_name', 'total'],
        filterable: ['id', 'registration_no', 'user.first_name', 'user.last_name', 'total'],

      },

      ratings: [
        { value: 5, label: 'Excellent' },
        { value: 4, label: 'Very Good' },
        { value: 3, label: 'Good' },
        { value: 2, label: 'Average' },
        { value: 1, label: 'Fair' },

      ],
      percentage_progress: 0,
      status: 'progress-bar progress-bar-red',

    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  mounted() {
    this.setMidTermAssessmentFields()
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
    // setMidTermAssessmentFields() {
    //   const app = this
    //   // const noOfMidtermCa = app.resultSettings.no_of_ca_for_midterm
    //   // // eslint-disable-next-line no-plusplus
    //   // for (let index = 1; index <= noOfMidtermCa; index++) {
    //   //   app.columns.push(`ca${index}`)
    //   // }
    //   app.columns.push('mid_term')
    //   app.columns.push('effort')
    //   app.columns.push('behavior')
    // },
    setMidTermAssessmentFields() {
      const app = this
      const { resultSettings } = app
      const noOfMidtermCa = resultSettings.no_of_ca_for_midterm
      if (noOfMidtermCa > 1) {
        // eslint-disable-next-line no-plusplus
        for (let index = 1; index <= noOfMidtermCa; index++) {
          app.columns.push(`mid_term${index}`)
        }
        app.columns.push('total')
      } else {
        app.columns.push('mid_term1')
      }
      app.columns.push('effort')
      app.columns.push('behavior')
    },

  },

}
</script>
