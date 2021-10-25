<template>
    <div>
        <div class="box" v-if="add_question && !set_quiz">

            <div class="box-header">
                <h4 class="box-title">Add {{option.question_type.toUpperCase()}} questions to {{subject_teacher.subject.name}} question bank</h4>
                <span class="pull-right">
                    <a id="view_question_bank" @click="add_question=false" class="btn btn-primary"><i class="fa fa-eye"></i> View Question Bank</a>
                    <a id="view_question_bank" @click="option.question_type= 'select'" class="btn btn-danger"><i class="fa fa-arrow-left"></i> Back</a>
                </span>
            </div>
            <div class="box-body">
                <form v-on:submit.prevent="saveForm()">
                    <div class="col-md-12">
                        <h4>Question</h4>
                        <!-- <vue-editor v-model="form.question" :customModules="customModulesForEditor" :editorOptions="editorSettings" placeholder="Type your question here..."></vue-editor> -->
                        <ckeditor :editor="editor" v-model="form.question" :config="editorConfig" />
                    </div>

                    <div class="col-md-12">
                        <h4>Assign Point to Question</h4>
                        <input type="number" v-model="form.point" class="form-control">

                    </div>
                    <div v-if="button_type == 'new'">
                        <button class="btn btn-success btn-lg"><i class="fa fa-save"></i> Save Question</button>
                    </div>
                    <div v-if="button_type == 'edit'">
                        <button class="btn btn-primary btn-lg"><i class="fa fa-edit"></i> Update Question</button>
                    </div>

                </form>
            </div>
            <span v-if="error" class="label label-danger">Kindly fill all empty fields and choose the correct option</span>
        </div>
        <div class="box" v-if="!add_question && !set_quiz">
            <div class="box-header">
                <h4 class="box-title">{{option.question_type.toUpperCase()}} Question Bank for {{subject_teacher.subject.code}} ({{subject_teacher.class_teacher.c_class.name}})</h4>
                <span class="pull-right">
                    <a @click="add_question=true" class="btn btn-warning"><i class="fa fa-plus"></i> Add New Question</a>
                    <a @click="set_quiz=true" class="btn btn-default"><i class="fa fa-question"></i> Set Examination</a>
                    <a id="view_question_bank" @click="option.question_type= 'select'" class="btn btn-danger"><i class="fa fa-arrow-left"></i> Back</a>
                </span>
            </div>
            <div class="box-body">
                <v-client-table
                    :data="subject_teacher.theory_questions"
                    :columns="columns"
                    :options="options">

                    <template slot="question" slot-scope="props">
                        <span v-html="props.row.question"></span>
                    </template>

                    <template slot="action" slot-scope="props">
                        <div class="table__actions">

                        <a @click="editQuestion(props.index, props.row)"  class="btn btn-primary"><i class="fa fa-edit"></i> Edit</a>

                        </div>
                    </template>

                </v-client-table>
            </div>
        </div>
        <div class="box" v-if="set_quiz">
            <div class="box-header">
                <h4 class="box-title">Examination for {{subject_teacher.subject.name}} ({{subject_teacher.class_teacher.c_class.name}})</h4>
                <span class="pull-right"><a id="view_question_bank" @click="add_question=false; set_quiz=false" class="btn btn-primary"><i class="fa fa-eye"></i> View Question Bank</a></span>
            </div>
            <div class="box-body">
                <set-quiz :subject_teacher="subject_teacher"/>
            </div>

        </div>
    </div>
</template>
<script>
import SetQuiz from './SetQuiz.vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-vue'//'quill-image-resize-module'

// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
export default {
    components: {
     SetQuiz
    },
    props: {
        subject_teacher: {
            type: Object,
            default: () => ({}),
        },
        option: {
            type: Object,
            default: () => ({
                question_type: 'theory'
            }),
        }

    },
    data() {
        return {
            set_quiz: false,
            add_question: false,
            columns: ['action', 'question', 'point'],
            options: {
                headings: {
                    question: 'Question',
                    point: 'Point',
                    action: 'Action',
                },
                sortable: ['question'],
                filterable: ['question']
            },
            form: {
                subject_teacher_id: this.subject_teacher.id,
                question: '',
                point: 10,
                question_type: this.option.question_type

            },
            empty_form: {
                subject_teacher_id: this.subject_teacher.id,
                question: '',
                point: 10,
                question_type: this.option.question_type
            },
            button_type: 'new',
            edit_question_index: '',
            editor: ClassicEditor,
            editorConfig: {
                // The configuration of the editor.
            },
            // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
            // editorSettings: {
            //     modules: {
            //     imageDrop: true,
            //     imageResize: {}
            //     }
            // },
            error: false,

        }
    },
    mounted() {

    },
    methods: {
        handleCenterLoading() {
            let l = this.$message.loading({
                message: 'loading...',
                align: 'center',

            })
            setTimeout(function () {
                l.close()
            }, 2000)
        },
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
        saveForm()
        {

            let app = this;
            app.error = false;
            //app.handleCenterLoading();
            let checkEmptyFields = app.form.question === '' || app.form.optA === '' || app.form.optB === '' || app.form.optC === '' || app.form.optD === '' || app.form.answer === ''


            if (checkEmptyFields === true){

                app.error = true;

                return
            }
            let l = app.$message.loading({
                message: 'loading...',
                align: 'center',

            })
            let formData = app.form;
            if (app.button_type == 'edit') {
                axios.post('/lms/update-question/'+formData.id, formData) //back end route from web.php

                .then(response => {
                    l.close();
                    app.subject_teacher.questions.splice(app.edit_question_index, 1);
                    app.subject_teacher.questions.push(response.data.question);
                    app.form = app.empty_form
                    app.notifyMe('Question Updated','Successful', 'success');
                    app.add_question = false;
                    //document.getElementById('view_question_bank').click();

                })
            }else{
                axios.post('/lms/store-question', formData) //back end route from web.php

                .then(response => {
                    l.close();
                    app.subject_teacher.questions.push(response.data.question);
                    app.form = app.empty_form
                    app.notifyMe('Question Added','Successful', 'success');

                })
            }

        },
        editQuestion(index, question)
        {
            let app = this;
            app.edit_question_index = index-1;
            app.form = question;
            question = '';
            app.button_type= 'edit';
            app.add_question=true
        },

    }
}
</script>

