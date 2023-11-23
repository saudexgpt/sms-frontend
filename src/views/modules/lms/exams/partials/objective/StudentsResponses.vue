<!--eslint-disable vue/no-v-html -->
<template>
  <div class="box">
    <el-card
      v-if="quizAttempts.length > 0"
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
          v-for="(quiz_attempt, index) in quizAttempts"
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
              <el-button
                type="primary"
                round
                @click="viewStudentDetails(quiz_attempt)"
              > Details
              </el-button>

            </td>

          </tr>
        </tbody>
      </table>

    </el-card>
    <el-card
      v-else
      class="box-body"
    >
      <div class="callout callout-danger">
        There is no response from any student yet!!!
      </div>
    </el-card>
    <el-dialog
      v-if="view_detail !== null"
      :visible.sync="centerDialogVisible"
      :title="view_detail.student.user.first_name + ' ' + view_detail.student.user.last_name"
      width="95%"
    >
      <div>
        <table class="table table-bordered">
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
              v-for="(answer, index_key) in view_detail.quiz_answers"
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
                <i class="fa fa-check green" />
                <feather-icon
                  icon="CheckIcon"
                  color="green"
                />
              </td>
              <td v-else>
                <feather-icon
                  icon="XIcon"
                  color="red"
                />
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    quizAttempts: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      quiz_answers: [],
      view_detail: null,
      centerDialogVisible: false,
    }
  },
  methods: {
    viewStudentDetails(quizAttempt) {
      const app = this
      app.view_detail = null
      app.view_detail = quizAttempt
      app.centerDialogVisible = true
      // document.getElementsByClassName('.child_table').style.display = 'none';
      // document.getElementById(index).style.display = 'block';
    },
  },
}
</script>
