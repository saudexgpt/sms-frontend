<template>
  <div>

    <v-client-table
      :data="students"
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
        {{ props.row.result_detail.ca1 }}

      </template>
      <template
        slot="ca2"
        slot-scope="props"
      >

        {{ props.row.result_detail.ca2 }}

      </template>
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

  },

}
</script>
