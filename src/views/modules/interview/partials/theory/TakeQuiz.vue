<template>
  <div>
    <div
      v-if="!start_quiz"
      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
    >
      <div
        class="div-square"
        align="center"
      >
        <h2>PLEASE NOTE THE INSTRUCTION BELOW</h2>
        <legend><font color="brown">
          <strong>When you start, DO NOT REFRESH THE PAGE. Use the Previous and Next Buttons to Navigate. <br>Click the Preview Button when done to preview before you finally submit.</strong>
        </font></legend>
        <p class="red">
          You are permitted to refresh the page only if no question appears
        </p>
        <label
          style="cursor: pointer;"
          @click="start_quiz = true"
        >
          <i class="fa fa-edit fa-5x" />
          <h1>Click to Start</h1>
        </label>
        <h4>Maximum Time: <i class="fa fa-clock" /> {{ compiled_quiz.duration }} seconds</h4>
      </div>
    </div>
    <div v-if="start_quiz">
      <quiz-questions :compiled_quiz="compiled_quiz" />
    </div>
  </div>
</template>
<script>
import QuizQuestions from './QuizQuestions.vue'

export default {
  components: { QuizQuestions },
  props: {
    compiledAuiz: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      start_quiz: false,
    }
  },
}
</script>
