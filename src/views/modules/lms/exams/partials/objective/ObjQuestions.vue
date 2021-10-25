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
                        <label class="red">For the question above, set answer options below. One of them must be correct. When done, click the correct option to aid automatic grading.</label>
                    </div>

                    <div class="col-md-6">
                        <label for="optA"><h4>Option A <input type="radio" id="optA" v-model="form.answer" value="A"></h4></label>
                        <ckeditor :editor="editor" v-model="form.optA" placeholder="Type Option A here..." :config="editorConfig" />
                    </div>
                    <div class="col-md-6">
                        <label for="optB"><h4>Option B <input type="radio" id="optB" v-model="form.answer" value="B"></h4></label>
                        <ckeditor :editor="editor" v-model="form.optB" placeholder="Type Option B here..." :config="editorConfig" />
                    </div>
                    <div class="col-md-6">
                        <label for="optC"><h4>Option C <input type="radio" id="optC" v-model="form.answer" value="C"></h4></label>
                        <ckeditor :editor="editor" v-model="form.optC" placeholder="Type Option C here..." :config="editorConfig" />
                    </div>
                    <div class="col-md-6">
                        <label for="optD"><h4>Option D <input type="radio" id="optD" v-model="form.answer" value="D"></h4></label>
                        <ckeditor :editor="editor" v-model="form.optD" placeholder="Type Option D here..." :config="editorConfig" />
                    </div>
                    <p></p>
                    <div v-if="button_type == 'new'">
                        <button class="btn btn-success btn-lg"><i class="fa fa-save"></i> Save Question</button>
                    </div>
                    <div v-if="button_type == 'edit'">
                        <button class="btn btn-primary btn-lg"><i class="fa fa-edit"></i> Update Question</button>
                    </div>

                    <!-- <div class="col-md-6">
                        <label for="optE"><h4>Option E <input type="radio" id="optE" v-model="form.answer" value="E"></h4></label>
                        <vue-editor v-model="form.optE" placeholder="Type Option E here..."></vue-editor>
                    </div> -->
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
                    :data="subject_teacher.questions"
                    :columns="columns"
                    :options="options">

                    <template slot="question" slot-scope="props">
                        <span v-html="props.row.question"></span>
                    </template>
                    <template slot="optA" slot-scope="props">
                        <span v-html="props.row.optA"></span>
                    </template>
                    <template slot="optB" slot-scope="props">
                        <span v-html="props.row.optB"></span>
                    </template>
                    <template slot="optC" slot-scope="props">
                        <span v-html="props.row.optC"></span>
                    </template>
                    <template slot="optD" slot-scope="props">
                        <span v-html="props.row.optD"></span>
                    </template>
                    <template slot="answer" slot-scope="props">
                        <span v-html="props.row.answer"></span>
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
// import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

// import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
// import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency';
// import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical';

// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
// ClassicEditor
//     .create( document.querySelector( '#editor' ), {
//         plugins: [  Essentials, Paragraph, Bold, Italic, Alignment, SpecialCharacters, SpecialCharactersCurrency, SpecialCharactersMathematical,],
//         toolbar: [ 'bold', 'italic', 'alignment', 'specialCharacters' ]
//     } )
//     .then()
//     .catch();

// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// //import ImageResize from 'quill-image-resize-module'

// Quill.register('modules/imageDrop', ImageDrop)
//Quill.register('modules/imageResize', ImageResize)
export default {
    components: {
        /*VueEditor, */SetQuiz
    },
    props: {
        subject_teacher: {
            type: Object,
            default: () => ({}),
        },
        option: {
            type: Object,
            default: () => ({
                question_type: 'objective'
            }),
        }

    },
    data() {
        return {
            set_quiz: false,
            add_question: false,
            columns: ['action', 'question', 'optA', 'optB', 'optC', 'optD',  'answer'],
            options: {
                headings: {
                    question: 'Question',
                    optA: 'Opt A',
                    optB: 'Opt B',
                    optC: 'Opt C',
                    optD: 'Opt D',
                    optE: 'Opt E',
                    answer: 'Answer',
                    point: 'Point',
                    action: 'Action',
                },
                sortable: ['question'],
                filterable: ['question']
            },
            form: {
                subject_teacher_id: this.subject_teacher.id,
                question: '',
                optA: '',
                optB: '',
                optC: '',
                optD: '',
                optE: '',
                answer: '',
                question_type: 'multi_choice',
                point: '1',
            },
            empty_form: {
                subject_teacher_id: this.subject_teacher.id,
                question: '',
                optA: '',
                optB: '',
                optC: '',
                optD: '',
                optE: '',
                answer: '',
                question_type: 'multi_choice',
                point: '1',
            },
            editor: ClassicEditor,
            editorConfig: {
                // The configuration of the editor.
            },
            button_type: 'new',
            edit_question_index: '',
            // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }/*, { alias: "imageResize", module: ImageResize }*/],
            // editorSettings: {
            //     modules: {
            //     // imageDrop: true,
            //     //imageResize: {}
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

