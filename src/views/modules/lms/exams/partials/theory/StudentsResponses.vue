<template>
    <div class="box">
        <div class="box-body" v-if="quiz_attempts.length > 0">
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
                <tbody v-for="(quiz_attempt, index) in quiz_attempts" :key="index">

                    <tr >
                        <td>{{index+1}}</td>
                        <td>
                            <div align="center">
                                <img :src="'/storage/'+quiz_attempt.student.user.photo" alt="Photo" class="img-circle" width="60"><br>
                                <strong class="">{{quiz_attempt.student.user.last_name}}, {{quiz_attempt.student.user.first_name}}</strong>
                            </div>
                        </td>
                        <td><strong class="green">{{quiz_attempt.student_point}}/{{quiz_attempt.score_limit}}</strong></td>
                        <td><strong class="blue">{{quiz_attempt.percent_score}}%</strong></td>
                        <td>

                            <div v-if="quiz_attempt.view == index" >
                                <a class="btn btn-danger" @click="quiz_attempt.view = null; hideStudentDetails(index,quiz_attempt)"> <i class="fa fa-eye-slash"></i>
                                    Hide Details
                                </a>
                            </div>
                            <div v-if="quiz_attempt.view == null" >
                                <a class="btn btn-default" @click="quiz_attempt.view = index; viewStudentDetails(index,quiz_attempt)"> <i class="fa fa-eye"></i>
                                    Show Details
                                </a>
                            </div>

                        </td>

                    </tr>
                    <tr v-if="view_details == index">
                        <td colspan="5">
                            <table class="table table-bordered child_table"   :id="index">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Question</th>
                                        <th>Student's Answer</th>
                                        <th>Score Student</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(answer, index_key) in quiz_attempt.quiz_answers" :key="index_key">
                                        <td>{{index_key+1}}</td>
                                        <td>
                                            <div style="height: 200px; overflow:auto">
                                                <span v-html="answer.theory_question.question"></span>
                                            </div>

                                        </td>

                                        <td>
                                            <div style="height: 200px; overflow:auto">
                                                <span v-html="answer.student_answer"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <select v-model="answer.point_earned" class="form-control" @input="scoreStudent(answer, index)">
                                                <option value="0">0</option>
                                                <option :value="counter" v-for="counter in answer.theory_question.point" :key="counter">{{counter}}</option>
                                            </select>

                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </td>

                    </tr>

                </tbody>
            </table>

        </div>
        <div class="box-body" v-else>
            <div class="callout callout-danger">There is no response from any student yet!!!</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        quiz_attempts: {
            type: Array,
            default: () => ([]),
        }
    },
    data() {
        return {
            quiz_answers: [],
            view_details: null
        }
    },
    methods: {
        viewStudentDetails(index,quiz_attempt)
        {
            let app = this;
            app.view_details = null;

            //app.quiz_answers = quiz_attempt.quiz_answers
            jQuery('.child_table').hide();
            jQuery('#'+index).show();
            app.view_details = index;
            //document.getElementsByClassName('.child_table').style.display = 'none';
            //document.getElementById(index).style.display = 'block';
        },
        hideStudentDetails(index,quiz_attempt)
        {
            let app = this;
            app.view_details = null;
            //app.quiz_answers = []
            jQuery('#'+index).hide();
            //document.getElementsByClassName('.child_table').style.display = 'none';
            //document.getElementById(index).style.display = 'block';
        },
        scoreStudent(answer, index)
        {
            let app = this;
            axios.post('/lms/score-theory-answers', answer) //back end route from web.php
            .then(response => {
                app.quiz_attempts[index] = response.data.quiz_attempt;
                //app.notifyMe('Score Recorded','Successful', 'success');

            })
            .catch(error => {
                alert(error);
            });
        }
    },
}
</script>
