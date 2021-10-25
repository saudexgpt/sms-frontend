<template>
    <div class="box" v-if="class_teachers.length > 0">
        <div class="box-body" v-if="!set_question">

            <div class="col-md-4 col-sm-4 col-xs-4">
                <span>Select Class to view</span>
            <!-- small box -->
                <select  v-model="class_teacher" class="form-control">
                    <option value="">Select Class</option>
                    <option v-for="(class_teacher,index) in class_teachers" :key="index" :value="class_teacher">{{class_teacher.c_class.name}}</option>
                </select>
            </div>

            <div class="col-md-12" v-if="class_teacher != ''">
                <h3>Subjects in {{class_teacher.c_class.name}}</h3>
                <div class="col-md-2 col-sm-3 col-xs-4" v-for="(subject_teacher, index) in class_teacher.subject_teachers" :key="index" >
                    <!-- small box -->
                    <a @click="setSubjectQuestion(subject_teacher)" class="small-box-footer">
                        <div class="small-box bg-gray-active" >
                            <a href="#" class="small-box-footer">
                            {{subject_teacher.subject.code}}
                            </a>
                            <div class="inner">
                            <h4>{{class_teacher.c_class.name}}</h4>

                            <p><strong>{{subject_teacher.subject.code}}</strong></p>
                            </div>

                        </div>
                    </a>
                </div>
            </div>
        </div>

        <div v-if="set_question">
            <span class=""><a @click="set_question=false" class="btn btn-default"><i class="fa fa-list"></i> Subject List</a></span>
            <!-- <subject-questions :subject_teacher="subject_teacher" /> -->
            <view-teacher-quiz :subject_teacher="subject_teacher"/>
        </div>
    </div>
</template>
<script>
import ViewTeacherQuiz from './partials/ViewTeacherQuiz.vue';
export default {
components: {ViewTeacherQuiz},
 data() {
     return {
        class_teachers: [],
        class_teacher: '',
        subject_teacher: {},
        set_question: false,


     }
 },
 mounted() {
     this.fetchData();
 },
 methods: {
    fetchData()
    {
        let app = this;
        let l = app.$message.loading({
                message: '...loading. This might take some time',
                align: 'center',

            })
        axios.get('/lms/quiz-dashboard') //back end route from web.php

        .then(response => {
            l.close();
            app.class_teachers = response.data.class_teachers;

        })
    },
    setSubjectQuestion(subject_teacher)
    {
        let app = this;
        app.set_question = false;
        app.subject_teacher = subject_teacher;
        app.subject_teacher.class_teacher = app.class_teacher;
        app.set_question = true;
    }
 }
}
</script>
