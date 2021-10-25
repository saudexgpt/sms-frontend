<template>
    <div v-if="can_view_teacher">
        <div class="col-md-4 col-sm-4 col-xs-4">
          <!-- small box -->
            <router-link to="set-questions" class="small-box-footer">
                <div class="small-box bg-aqua">
                    <div class="inner">
                    <h3>{{teacher_questions}}</h3>

                    <p><strong>Question Bank</strong></p>
                    </div>
                    <div class="icon">
                    <i class="fa fa-question"></i>
                    </div>

                </div>
            </router-link>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-4">
          <!-- small box -->
            <a href="#" class="small-box-footer">
                <div class="small-box bg-red">
                    <div class="inner">
                    <h3>{{compiled_quizzes}}</h3>

                    <p><strong>Quizzes</strong></p>
                    </div>
                    <div class="icon">
                    <i class="fa fa-puzzle-piece"></i>
                    </div>

                </div>
            </a>
        </div>
        <div class="col-md-4 col-sm-4 col-xs-4">
          <!-- small box -->
            <a href="#" class="small-box-footer">
                <div class="small-box bg-green">
                    <div class="inner">
                    <h3>{{quiz_attempts}}</h3>

                    <p><strong>Attempts</strong></p>
                    </div>
                    <div class="icon">
                    <i class="glyphicon glyphicon-edit"></i>
                    </div>

                </div>
            </a>
        </div>
    </div>
</template>
<script>
export default {
 data() {
     return {
        teacher_questions: 0,
        compiled_quizzes: 0,
        quiz_attempts: 0,
        can_view_teacher: false,

     }
 },
 mounted() {
     this.fetchData();
 },
 methods: {
    fetchData()
    {
        let app = this;
        axios.get('/lms/quiz-dashboard') //back end route from web.php

        .then(response => {
            app.teacher_questions = response.data.teacher_questions;
            app.compiled_quizzes = response.data.compiled_quizzes;
            app.teacher_questions = response.data.teacher_questions;
            app.can_view_teacher = response.data.can_view_teacher;


        })
    }
 }
}
</script>
