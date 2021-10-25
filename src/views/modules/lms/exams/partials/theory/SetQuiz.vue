<template>
    <div>
        <div class="box" v-if="!view_students_responses">
            <div class="box-header">
                <a @click="compiled_exam = true; new_compilation=false; edit_compilation=false" class="btn btn-info">Compiled Exam</a>
                <a @click="compiled_exam = false; new_compilation=true; edit_compilation=false; form=empty_form;" class="btn btn-success">New Compilation</a>

            </div>
            <div class="box-body">
                <div  v-if="compiled_exam">
                    <div v-if="subject_teacher.quiz_compilations.length < 1">
                        <div class="callout callout-danger">No quiz is compiled for {{subject_teacher.subject.name}}</div>
                    </div>
                    <div v-else>
                        <div class="col-md-3 col-sm-4 col-xs-6"  v-for="(compiled_quiz, index) in subject_teacher.quiz_compilations" :key="index">
                            <div class="div-square">
                                <i class="fa fa-folder fa-3x"></i>
                                <p>
                                    <strong class="red">{{compiled_quiz.question_type.toUpperCase()}} EXAM ID: {{compiled_quiz.id}}</strong><br>
                                    <strong class="">{{compiled_quiz.quizzes.length}} Questions Compiled</strong>
                                </p>

                                <p>
                                    <a @click="editCompilation(index,compiled_quiz)"><i class="fa fa-edit"></i> Edit</a> |
                                    <a @click="deleteCompiledQuiz(compiled_quiz, index)"><i class="fa fa-trash"></i> Delete</a>
                                </p>

                                <div v-if="compiled_quiz.status == 'Inactive'">
                                    <a @click="activateQuiz(compiled_quiz, 'Active')" class="btn btn-success btn-sm">Activate</a>
                                </div>
                                <div v-if="compiled_quiz.status == 'Active'">
                                    <a @click="activateQuiz(compiled_quiz, 'Inactive')" class="btn btn-danger btn-sm">Deactivate</a>
                                </div>
                                <p>
                                    <a @click="viewResponses(compiled_quiz)" class="btn btn-primary"><i class="fa fa-users"></i> Students' Responses</a>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.tab-pane -->
                <div class="tab-pane" v-if="new_compilation || edit_compilation">
                    <div class="col-md-8">
                        <div class="box primary" >
                            <div class="box-header bg-blue">
                                <h4 class="box-title">Select questions for quiz</h4>

                            </div>
                            <div class="box-body">
                                <v-client-table
                                    :data="subject_teacher.theory_questions"
                                    :columns="columns"
                                    :options="options">

                                    <template slot="question" slot-scope="props">
                                        <span v-html="props.row.question"></span>
                                    </template>

                                    <template slot="select" slot-scope="props">
                                        <div class="table__actions">

                                        <input type="checkbox" v-model="form.question_ids" :value="props.row.id">

                                        </div>
                                    </template>

                                </v-client-table>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="box primary">
                            <div class="box-header bg-blue">
                                <h4 class="box-title">Compilation Form</h4>
                            </div>
                            <div class="box-body">
                                <form v-on:submit.prevent="saveQuiz()">
                                    <div class="col-md-12">
                                        <label for="">Selected Questions</label>
                                        <input type="text" v-model="form.question_ids"  disabled class="form-control">
                                    </div>
                                    <div class="col-md-12">
                                        <label for="">Brief instruction</label>
                                        <input type="text" v-model="form.instructions" placeholder="Give brief instruction" class="form-control">
                                    </div>
                                    <div class="col-md-12">
                                        <label for="">Quiz duration in seconds [Remember 60secs = 1min]</label>
                                        <input type="number" v-model="form.duration" class="form-control">
                                    </div>
                                    <div class="col-md-12">
                                        <label for="">Points to be acquired</label>
                                        <select v-model="form.point" class="form-control">
                                            <option v-for="(point, index) in points" :key="index" :value="point">{{point}}</option>
                                        </select>

                                    </div>
                                    <div class="col-md-12">
                                        <label for="">Status [Students can access if active]</label>
                                        <select v-model="form.status" class="form-control">
                                            <option value="Inactive">Inactive</option>
                                            <option value="Active">Active</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <p></p>
                                        <button v-if="edit_compilation" type="submit" class="btn btn-success"><i class="fa fa-save"></i> Update</button>
                                        <button v-else type="submit" class="btn btn-success"><i class="fa fa-save"></i> Compile</button>


                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div v-if="view_students_responses">
            <div v-if="quiz_attempts.length > 0">
                <div class="box-body" >
                    <label >Note: This test is graded over {{quiz_attempts[0].score_limit}}</label>
                    <legend class="red">To record this test, select an assessment and click on <code>Record Score</code></legend>
                    <div class="col-xs-9">
                        <select v-model="record_score.assessment" class="form-control">
                            <option value="">Select Assessment</option>
                            <option v-for="(assessment, index) in assessments" :value="assessment.value" :key="index">{{assessment.label}}</option>
                        </select>
                    </div>
                    <div class="col-xs-3">
                        <a @click="recordScore()" class="btn btn-success">Record Score</a>
                    </div>

                </div>
                <students-responses :quiz_attempts="quiz_attempts"/>
            </div>

        </div>
    </div>
</template>
<script>
import StudentsResponses from './StudentsResponses';
export default {
    components : {StudentsResponses},
    props: {
        subject_teacher: {
            type: Object,
            default: () => ({}),
        }

    },
    data() {
        return {
            assessments: [
                {value:'mid_term', label: 'Mid Term'},
                {value:'ca1', label: 'First C.A'},
                {value:'ca2', label: 'Second C.A'},
                {value:'ca3', label: 'Third C.A'},
                {value:'exam', label: 'Examination'}


                ],
            view_students_responses: false,
            quiz_attempts: [],
            points: [10,20,30,50,60,70,100],
            columns: ['select', 'question'],
            options: {
                headings: {
                    question: 'Question',

                    select: 'Select',
                },
                sortable: [],
                filterable: ['question']
            },
            form: {
                subject_teacher_id: this.subject_teacher.id,
                instructions: '',
                duration: 60,
                point: 30,
                status: 'Inactive',
                question_ids: [],
                question_type: 'theory'

            },
            empty_form: {
                subject_teacher_id: this.subject_teacher.id,
                instructions: '',
                duration: 60,
                point: 30,
                status: 'Inactive',
                question_ids: [],
                question_type: 'theory'
            },
            record_score: {
                assessment: '',
                quiz_attempts: []

            },
            error: false,
            edit_compilation: false,
            compiled_exam: true,
            new_compilation: false,
            edit_quiz_index: '',

        }
    },
    methods: {
        notifyMe(message,title,type) {

            if (type == 'success') {
                this.$toast.success({
                    title:title,
                    message:message
                })
            }else if(type == 'warning'){
                this.$toast.warning({
                    title:title,
                    message:message
                })
            }else{
                this.$toast.error({
                    title:title,
                    message:message
                })
            }



        },
        deleteCompiledQuiz(compiled_quiz, index){
            let app = this;
            var alert = "Confirm Delete Action! This cannot be undone";
            if (confirm(alert)) {
                let l = app.$message.loading({
                    message: 'deleting...',
                    align: 'center',
                })
                let formData = compiled_quiz;
                axios.post('/lms/delete-quiz/'+formData.id, formData) //back end route from web.php

                .then(response => {
                    l.close();
                    app.subject_teacher.quiz_compilations.splice(index, 1);
                    //app.subject_teacher.quiz_compilations.push(response.data.quiz_compilations);
                    //app.subject_teacher.quiz_compilations = response.data.quiz_compilations;

                })
            }
        },
        activateQuiz(compiled_quiz, status)
        {
            let app = this;
            var message = "Confirm Action";
            if (confirm(message)) {
                compiled_quiz.status = status;
                let l = app.$message.loading({
                    message: 'loading...',
                    align: 'center',
                })
                let formData = compiled_quiz;
                axios.post('/lms/activate-quiz/'+formData.id, formData) //back end route from web.php

                .then(response => {
                    l.close();
                    //app.subject_teacher.quiz_compilations.push(response.data.quiz_compilations);
                    //app.subject_teacher.quiz_compilations = response.data.quiz_compilations;

                })
            }


        },
        editCompilation(index,compiled_quiz)
        {
            let app = this;
            var question_ids = [];
            compiled_quiz.quizzes.forEach(element => {
                question_ids.push(element.question_id);
            });
            app.form.id = compiled_quiz.id;
            app.form.subject_teacher_id = compiled_quiz.subject_teacher_id,
            app.form.instructions = compiled_quiz.instructions,
            app.form.duration = compiled_quiz.duration,
            app.form.point = compiled_quiz.point
            app.form.status = compiled_quiz.status
            app.form.question_ids = question_ids

            app.edit_compilation = true;
            app.compiled_exam = false;
            app.edit_quiz_index = index;

        },
        saveQuiz()
        {
            let app = this;
            app.error = false;
            //app.handleCenterLoading();
            let checkEmptyFields = app.form.question_ids.length === 0 || app.form.instructions === ''


            if (checkEmptyFields === true){

                app.error = true;

                return
            }
            let l = app.$message.loading({
                message: 'loading...',
                align: 'center',
            })
            let formData = app.form;

            if (app.edit_compilation) {
                axios.post('/lms/update-quiz/'+formData.id, formData) //back end route from web.php

                .then(response => {
                    l.close();
                    app.subject_teacher.quiz_compilations.splice(app.edit_quiz_index, 1);
                    app.subject_teacher.quiz_compilations.push(response.data.compilation);
                    // app.form = app.empty_form
                    app.notifyMe('Quiz Updated','Successful', 'success');


                })
            }else{
                axios.post('/lms/set-quiz', formData) //back end route from web.php
                .then(response => {
                    l.close();
                    app.subject_teacher.quiz_compilations.push(response.data.compilation);
                    //app.subject_teacher.quiz_compilations = response.data.quiz_compilations;
                    app.form = app.empty_form
                    app.notifyMe('Quiz Compiled','Successful', 'success');

                })
            }
        },
        viewResponses(compiled_quiz)
        {
            let app = this;
            app.handleCenterLoading();
            app.view_students_responses = true;
            app.quiz_attempts = compiled_quiz.quiz_attempts;
            app.compiled_quiz = compiled_quiz;
        },
        handleCenterLoading() {
            let l = this.$message.loading({
                message: 'loading...',
                align: 'center',

            })
            setTimeout(function () {
                l.close()
            }, 500)
        },
        recordScore()
        {
            let app = this;
            let param = app.record_score;
            param.quiz_attempts = app.quiz_attempts;
            let l = this.$message.loading({
                message: 'recording score...',
                align: 'center',

            })

            axios.post('/result/record-cbt-score', param) //back end route from web.php
            .then(response => {
                l.close();
                app.notifyMe('Score Recorded','Successful', 'success');

            })
        }
    }
}
</script>
