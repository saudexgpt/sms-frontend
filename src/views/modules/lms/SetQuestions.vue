<template>
  <div>
    <div v-if="!select_question_type">
      <div
        class="col-md-2 col-sm-3 col-xs-4"
        v-for="(subject_teacher, index) in subject_teachers"
        :key="index"
      >
        <!-- small box -->
        <a @click="setSubjectQuestion(subject_teacher)" class="small-box-footer">
          <div class="small-box bg-gray-active">
            <a href="#" class="small-box-footer">{{subject_teacher.subject.code}}</a>
            <div class="inner">
              <h4>{{subject_teacher.class_teacher.c_class.name}}</h4>

              <p>
                <strong>{{subject_teacher.subject.code}}</strong>
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div v-if="select_question_type">
      <span class>
        <a @click="select_question_type=false" class="btn btn-default">
          <i class="fa fa-list"></i> Subject List
        </a>
      </span>
      <select-question-type :subject_teacher="subject_teacher" />
    </div>
  </div>
</template>
<script>
import SelectQuestionType from "./SelectQuestionType";
export default {
  components: { SelectQuestionType },
  data() {
    return {
      subject_teachers: [],
      subject_teacher: {},
      select_question_type: false,
    };
  },
  mounted() {
    this.subjectTeachers();
    //  var timeinterval = setInterval(() => {
    //     this.subjectTeachers();
    // }, 5000)
  },
  methods: {
    subjectTeachers() {
      let app = this;
      let l = app.$message.loading({
        message: "loading...",
        align: "center",
      });
      axios
        .get("/lms/subject-teachers") //back end route from web.php

        .then((response) => {
          app.subject_teachers = response.data.subject_teachers;
          l.close();
        });
    },
    setSubjectQuestion(subject_teacher) {
      let app = this;
      app.select_question_type = false;
      app.subject_teacher = subject_teacher;
      app.select_question_type = true;
    },
  },
};
</script>
