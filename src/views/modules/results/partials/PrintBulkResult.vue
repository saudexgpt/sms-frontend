<template>
  <div class="">
    <div
      v-for="(student_in_class,index) in broadSheetData.students_in_class"
      :key="index"
    >
      <student-result-details
        :is-sub-page="true"
        :param="params"
        :student-id="student_in_class.student_id"
      />
      <div class="pagebreak" />

    </div>
  </div>
</template>

<script>
import StudentResultDetails from '../StudentResultDetails.vue'

export default {
  components: { StudentResultDetails },
  props: {
    broadSheetData: {
      type: Object,
      default: () => ({}),
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
    }
  },

}
</script>
<style scoped>
@media print {
    .pagebreak {
        clear: both;
        page-break-after: always;
        padding: 5px;
    }
}
</style>
