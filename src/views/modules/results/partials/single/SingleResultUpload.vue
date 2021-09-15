<template>
  <div>
    <div v-if="studentData.active_assessment == 'half'">

      <half-term
        :student-data="studentData"
        :form="form"
      />
    </div>
    <div v-if="studentData.active_assessment == 'full'">

      <full-term
        :student-data="studentData"
        :form="form"
      />
    </div>
  </div>
</template>
<script>
import HalfTerm from './HalfTerm.vue'
import FullTerm from './FullTerm.vue'

export default {

  components: {
    HalfTerm, FullTerm,
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

}
</script>
