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
      </template>
      <template
        slot="mid_term"
        slot-scope="props"
      >
        {{ props.row.result_detail.mid_term }}

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
          mid_term: 'Total (100%)',
          ca1: `C.A 1 (${this.resultSettings.ca1}%)`,
          ca2: `C.A 2 (${this.resultSettings.ca2}%)`,
          ca3: `C.A 3 (${this.resultSettings.ca3}%)`,
          ca4: `C.A 4 (${this.resultSettings.ca4}%)`,
          ca5: `C.A 5 (${this.resultSettings.ca5}%)`,
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
    setMidTermAssessmentFields() {
      const app = this
      // const noOfMidtermCa = app.resultSettings.no_of_ca_for_midterm
      // // eslint-disable-next-line no-plusplus
      // for (let index = 1; index <= noOfMidtermCa; index++) {
      //   app.columns.push(`ca${index}`)
      // }
      app.columns.push('mid_term')
      app.columns.push('effort')
      app.columns.push('behavior')
    },

  },

}
</script>
