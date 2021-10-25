<template>
    <div class="box">
        <div class="box-header">
            <div class="box-title">Created Classrooms</div>

        </div>
        <div class="box-body">
            <div v-if="!go_online">
                <span class="pull-right">
                    <a @click="fetchData('yes')" class="btn btn-default">All Classrooms</a>
                    <a @click="fetchData('no')" class="btn btn-default">Today's Classrooms</a>
                </span>
                <v-client-table
                    :data="daily_classrooms"
                    :columns="columns"
                    :options="options">

                    <template slot="subject" slot-scope="props">
                        <span v-html="props.row.subject_teacher.subject.name"></span>
                    </template>
                    <template slot="teacher" slot-scope="props">
                        {{props.row.subject_teacher.staff.user.first_name}}
                        {{props.row.subject_teacher.staff.user.last_name}}
                    </template>


                    <template slot="action" slot-scope="props">
                        <a @click="viewStudents(props.row)" class="btn btn-primary btn-sm"><i class="fa fa-users"></i> View Class</a>
                    </template>

                </v-client-table>
            </div>

            <div v-if="go_online">
                <a @click="go_online = false" class="btn btn-danger"> Go Back</a>
                <view-online-students :daily_classroom="daily_classroom" :query-string="query_string" />
            </div>
        </div>

    </div>
</template>
<script>
import ViewOnlineStudents from './partials/ViewOnlineStudents';
export default {
    components: {ViewOnlineStudents},
    data() {
        return {
            daily_classrooms: [],
            columns: ['subject', 'topic', 'start', 'end', 'teacher', 'date', 'action'],
            options: {
                headings: {
                    subject: 'Subject',
                    topic: 'Topic',
                    duration: 'Duration (minutes)',
                    teacher: 'Subject Teacher',
                    date: 'Date',
                    action: 'Action'
                },
                sortable: ['subject', 'class'],
                filterable: ['subject', 'class']
            },

            daily_classroom: {materials: []},
            go_online: false,
            view_all: 'no',
            query_string: '',
        }
    },
 mounted() {
     this.fetchData('no');
 },
 methods: {
    fetchData(view_all)
    {
        let app = this;
        let l = app.$message.loading({
                message: '...loading. This might take some time',
                align: 'center',

            })
        axios.get('/lms/created-online-classrooms?option='+view_all) //back end route from web.php

        .then(response => {
            l.close();
            app.daily_classrooms = response.data.daily_classrooms;


        })
    },

    viewStudents(daily_classroom)
    {
        let app = this;
        app.daily_classroom = daily_classroom;
        const name = 'Proprietor';
        app.query_string = '?open=false&sessionid='+daily_classroom.subject_teacher_id+'&publicRoomIdentifier=dashboard&userFullName='+name
        app.go_online = true;

    }
 }
}
</script>
