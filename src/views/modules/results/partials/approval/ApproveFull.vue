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
  },
  data() {
    return {
      columns: ['photo', 'id', 'name', 'ca1', 'ca2', 'ca3', 'exam', 'total', 'comments'],
      options: {
        headings: {
          photo: 'Photo',
          id: 'ID',
          name: 'Name',
          ca1: '1st C.A (20%)',
          ca2: '2nd C.A (10%)',
          ca3: '3rd C.A (10%)',
          exam: 'Exam (60%)',
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
  methods: {
    avatarText,
  },

}
</script>
