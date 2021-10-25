<template>
    <div class="box">
        <div class="box-header">
            <div class="box-title">My Subjects</div>
        </div>
        <div class="box-body">
            <div v-if="!set_online_class">
                <v-client-table
                    :data="subject_teachers"
                    :columns="columns"
                    :options="options">

                    <template slot="subject" slot-scope="props">
                        <span v-html="props.row.subject.name"></span>
                    </template>
                    <template slot="class" slot-scope="props">
                        <span v-html="props.row.class_teacher.c_class.name"></span>
                    </template>


                    <template slot="days" slot-scope="props">
                        <span v-for="(routine , routine_index) in props.row.routines" :key="routine_index">

                            <a @click="setOnlineClass(days[routine.day-1],routine.day, props.row)" class="btn btn-primary btn-sm"><i class="fa fa-users"></i> {{days[routine.day-1]}}</a>

                        </span>
                    </template>

                </v-client-table>
            </div>
            <div v-if="set_online_class">
                <a @click="set_online_class = false" class="btn btn-danger"> Go Back</a>
                <set-online-class :day="day" :day_in_words="day_in_words" :subject_teacher="subject_teacher"/>
            </div>

        </div>

    </div>
</template>
<script>
import SetOnlineClass from './partials/SetOnlineClass'
export default {
    components: {SetOnlineClass},
    data() {
        return {
            subject_teachers: [],
            columns: ['subject', 'class', 'days'],
            options: {
                headings: {
                    subject: 'Subject',
                    class: 'Class',

                    days: 'Days (Click to setup online class for each day)',
                },
                sortable: ['subject', 'class'],
                filterable: ['subject', 'class']
            },
            days: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
            set_online_class: false,

            subject_teacher: '',
            day: '',
            day_in_words: ''
        }
    },
 mounted() {
     this.fetchData();
 },
 methods: {
    fetchData()
    {
        let app = this;
        axios.get('/lms/teacher-routine') //back end route from web.php

        .then(response => {
            app.subject_teachers = response.data.subject_teachers;


        })
    },
    setOnlineClass(day_in_words, day, subject_teacher)
    {
        let app = this;
        app.day_in_words = day_in_words;
        app.day = day;
        app.subject_teacher = subject_teacher;
        app.set_online_class = true;
    }
 }
}
</script>
