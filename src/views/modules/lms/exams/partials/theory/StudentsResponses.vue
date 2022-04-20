<!-- eslint-disable vue/no-v-html -->
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
      <div class="table-responsive">
        <table
          :id="index"
          class="table table-bordered child_table"
        >
          <thead>
            <tr>
              <th>S/N</th>
              <th>Question</th>
              <th>Student's Answer</th>
              <th>Score Student</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(answer, index_key) in view_detail.quiz_answers"
              :key="index_key"
            >
              <td>{{ index_key+1 }}</td>
              <td>
                <div style="height: 200px; overflow:auto">
                  <span v-html="answer.theory_question.question" />
                </div>

              </td>

              <td>
                <div style="height: 200px; overflow:auto">
                  <span v-html="answer.student_answer" />
                </div>
              </td>
              <td>
                <select
                  v-model="answer.point_earned"
                  class="form-control"
                  @input="scoreStudent(answer, index)"
                >
                  <option value="0">
                    0
                  </option>
                  <option
                    v-for="counter in answer.theory_question.point"
                    :key="counter"
                    :value="counter"
                  >
                    {{ counter }}
                  </option>
                </select>

              </td>

            </tr>
          </tbody>
        </table>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import Resource from '@/api/resource'

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
    viewStudentDetails(index, quizAttempt) {
      const app = this
      app.view_detail = null
      app.centerDialogVisible = true
      app.view_detail = quizAttempt
      // document.getElementsByClassName('.child_table').style.display = 'none';
      // document.getElementById(index).style.display = 'block';
    },
    scoreStudent(answer, index) {
      const app = this
      const scoreStudentResource = new Resource('lms/score-theory-answers')
      scoreStudentResource.store(answer) // back end route from web.php
        .then(response => {
          app.quizAttempts[index] = response.quiz_attempt
          // app.notifyMe('Score Recorded','Successful', 'success');
        })
        .catch(error => {
          app.$alert(error)
        })
    },
  },
}
</script>
