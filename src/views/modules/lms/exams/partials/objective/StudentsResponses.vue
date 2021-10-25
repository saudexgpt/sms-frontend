<template>
  <div class="box">
    <div
      v-if="quiz_attempts.length > 0"
      class="box-body"
    >
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Student</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody
          v-for="(quiz_attempt, index) in quiz_attempts"
          :key="index"
        >

          <tr>
            <td>{{ index+1 }}</td>
            <td>
              <div align="center">
                <img
                  :src="'/storage/'+quiz_attempt.student.user.photo"
                  alt="Photo"
                  class="img-circle"
                  width="60"
                ><br>
                <strong class="">{{ quiz_attempt.student.user.last_name }}, {{ quiz_attempt.student.user.first_name }}</strong>
              </div>
            </td>
            <td><strong class="green">{{ quiz_attempt.student_point }}/{{ quiz_attempt.score_limit }}</strong></td>
            <td><strong class="blue">{{ quiz_attempt.percent_score }}%</strong></td>
            <td>

              <div v-if="quiz_attempt.view == index">
                <a
                  class="btn btn-danger"
                  @click="quiz_attempt.view = null; hideStudentDetails(index,quiz_attempt)"
                > <i class="fa fa-eye-slash" />
                  Hide Details
                </a>
              </div>
              <div v-if="quiz_attempt.view == null">
                <a
                  class="btn btn-default"
                  @click="quiz_attempt.view = index; viewStudentDetails(index,quiz_attempt)"
                > <i class="fa fa-eye" />
                  Show Details
                </a>
              </div>

            </td>

          </tr>
          <tr v-if="view_details == index">
            <td colspan="5">
              <table
                :id="index"
                class="table table-bordered child_table"
              >
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Question</th>
                    <th>OptA</th>
                    <th>OptB</th>
                    <th>OptC</th>
                    <th>OptD</th>
                    <th>Student's Choice</th>
                    <th>Answer</th>
                    <th>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(answer, index_key) in quiz_attempt.quiz_answers"
                    :key="index_key"
                  >
                    <td>{{ index_key+1 }}</td>
                    <td><span v-html="answer.question.question" /></td>
                    <td><span v-html="answer.question.optA" /></td>
                    <td><span v-html="answer.question.optB" /></td>
                    <td><span v-html="answer.question.optC" /></td>
                    <td><span v-html="answer.question.optD" /></td>
                    <td>{{ answer.student_answer }}</td>
                    <td>{{ answer.question.answer }}</td>
                    <td v-if="answer.point_earned == 1">
                      <i class="fa fa-check green" /></td>
                    <td v-else>
                      <i class="fa fa-remove red" /></td>
                  </tr>
                </tbody>
              </table>
            </td>

          </tr>

        </tbody>
      </table>

    </div>
    <div
      v-else
      class="box-body"
    >
      <div class="callout callout-danger">
        There is no response from any student yet!!!
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    quiz_attempts: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      quiz_answers: [],
      view_details: null,
    }
  },
  methods: {
    viewStudentDetails(index, quiz_attempt) {
      const app = this
      app.view_details = null

      // app.quiz_answers = quiz_attempt.quiz_answers
      jQuery('.child_table').hide()
      jQuery(`#${index}`).show()
      app.view_details = index
      // document.getElementsByClassName('.child_table').style.display = 'none';
      // document.getElementById(index).style.display = 'block';
    },
    hideStudentDetails(index, quiz_attempt) {
      const app = this
      app.view_details = null
      // app.quiz_answers = []
      jQuery(`#${index}`).hide()
      // document.getElementsByClassName('.child_table').style.display = 'none';
      // document.getElementById(index).style.display = 'block';
    },
  },
}
</script>
