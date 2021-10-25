<template>
    <div>
        <div class="box" v-if="option.question_type == 'select'">

            <div class="box-header">
                <h4 class="box-title">Select Question Type</h4>
            </div>
            <div class="box-body">
                <div class="col-md-3 col-sm-4 col-xs-6">
                <!-- small box -->
                    <a @click="option.question_type='objective'" class="small-box-footer">
                        <div class="small-box bg-gray-active" >
                            <a href="#" class="small-box-footer">
                            {{subject_teacher.subject.code}}
                            </a>
                            <div class="inner">
                            <h4><i class="fa fa-list fa-5x"></i></h4>

                            <p><strong>Objective Questions</strong></p>
                            </div>

                        </div>
                    </a>
                </div>
                <div class="col-md-3 col-sm-4 col-xs-6">
                <!-- small box -->
                    <a @click="option.question_type ='theory'" class="small-box-footer">
                        <div class="small-box bg-gray-active" >
                            <a href="#" class="small-box-footer">
                            {{subject_teacher.subject.code}}
                            </a>
                            <div class="inner">
                            <h4><i class="fa fa-edit fa-5x"></i></h4>

                            <p><strong>Theory Questions</strong></p>
                            </div>

                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div v-if="option.question_type=='objective'">
            <obj-questions :subject_teacher="subject_teacher" :option="option" />
        </div>
        <div v-if="option.question_type=='theory'">
            <theory-questions :subject_teacher="subject_teacher" :option="option" />
        </div>
    </div>
</template>
<script>
import ObjQuestions from './partials/objective/ObjQuestions';
import TheoryQuestions from './partials/theory/TheoryQuestions';


export default {
    components: {
        ObjQuestions, TheoryQuestions
    },
    props: {
        subject_teacher: {
            type: Object,
            default: () => ({}),
        }

    },
    data() {
        return {
            option: {
                question_type: 'select'
            },



        }
    },

}
</script>

