<template>
  <div>
    <div
      class="box primary"
      v-if="!show_upload_form && create_new && !view_students"
    >
      <div class="box-header bg-blue">
        <h4 class="box-title">
          Set Online Classroom on {{ subject_teacher.subject.name }} ({{
            subject_teacher.class_teacher.c_class.name
          }}) for {{ day_in_words }}
        </h4>

        <span class="pull-right"
          ><a @click="create_new = false" class="btn btn-warning fa fa-eye">
            View All Classes</a
          ></span
        >
      </div>
      <div class="box-body">
        <form v-on:submit.prevent="saveClass()">
          <div class="col-md-12">
            <label for="">Topic for this class</label>
            <input
              type="text"
              v-model="form.topic"
              class="form-control"
              placeholder="Example: Introduction of Computer"
              required
            />
          </div>
          <div class="col-md-12">
            <label for="">Brief description of topic</label>
            <textarea
              v-model="form.description"
              placeholder="Example: Computer is an electronic machine that accepts data...and so on"
              cols="30"
              rows="3"
              class="form-control"
              required
            ></textarea>
          </div>
          <div class="col-md-12">
            <label for="">Date of class</label>
            <input
              type="date"
              v-model="form.date"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6">
            <p></p>
            <button type="submit" class="btn btn-success">
              <i class="fa fa-save"></i> Create E-Classroom
            </button>
          </div>
        </form>
      </div>
    </div>
    <div
      class="box primary"
      v-if="!show_upload_form && !create_new && !view_students"
    >
      <div class="box-header">
        <h4 class="box-title">
          Created Online Classes on {{ subject_teacher.subject.name }} ({{
            subject_teacher.class_teacher.c_class.name
          }})
        </h4>
        <span class="pull-right"
          ><a @click="create_new = true" class="btn btn-success fa fa-plus">
            New Online Class</a
          ></span
        >
      </div>
      <div class="box-body">
        <v-client-table
          :data="subject_teacher.daily_classrooms"
          :columns="columns"
          :options="options"
        >
          <template slot="action" slot-scope="props">
            <a @click="uploadResources(props.row)" class="btn btn-primary"
              ><i class="fa fa-upload"></i> Upload Resources</a
            >
            <a @click="viewStudents(props.row)" class="btn btn-success"
              ><i class="fa fa-users"></i> Join Online Class</a
            >
            <a
              @click="deleteClass(props.index, props.row.id)"
              class="btn btn-danger"
              ><i class="fa fa-trash"></i> Delete</a
            >
          </template>
        </v-client-table>
      </div>
    </div>
    <div v-if="show_upload_form && !view_students">
      <a @click="show_upload_form = false" class="btn btn-default pull-right">
        Cancel</a
      >
      <upload-learning-resources
        :daily_classroom="daily_classroom"
        :showform="true"
      />
    </div>

    <div v-if="view_students">
      <div class="col-md-12">
        <a @click="view_students = false" class="btn btn-default pull-right">
          Cancel</a
        >
      </div>
      <view-online-students
        :daily_classroom="daily_classroom"
        :query-string="query_string"
      />
    </div>
  </div>
</template>
<script>
import UploadLearningResources from "./UploadLearningResources-new";
import ViewOnlineStudents from "./ViewOnlineStudents";
export default {
  components: { UploadLearningResources, ViewOnlineStudents },
  props: {
    subject_teacher: {
      type: Object,
      default: () => [],
    },
    day: {
      type: String,
      dafault: () => "",
    },
    day_in_words: {
      type: String,
      dafault: () => "",
    },
  },
  data() {
    return {
      columns: ["topic", "date", "duration", "start", "end", "action"],
      options: {
        headings: {
          topic: "Topic",
          duration: "Duration (in minutes)",

          date: "Date of Class",
          action: "Action",
        },
        sortable: ["topic", "date"],
        filterable: ["topic", "date"],
      },
      form: {
        topic: "",
        description: "",
        date: "",
        subject_teacher_id: this.subject_teacher.id,
        class_teacher_id: this.subject_teacher.class_teacher_id,
        day: this.day,
      },
      empty_form: {
        topic: "",
        description: "",
        date: "",
        subject_teacher_id: this.subject_teacher.id,
        class_teacher_id: this.subject_teacher.class_teacher_id,
        day: this.day,
      },
      daily_classroom: "",
      show_upload_form: false,
      create_new: false,
      view_students: false,
      query_string: "",
    };
  },
  methods: {
    notifyMe(message, title, type) {
      if (type == "success") {
        this.$toast.success({
          title: title,
          message: message,
        });
      } else if (type == "warning") {
        this.$toast.warning({
          title: title,
          message: message,
        });
      } else {
        this.$toast.error({
          title: title,
          message: message,
        });
      }
    },
    saveClass() {
      let app = this;
      let param = app.form;
      let l = app.$message.loading({
        message: "creating online class...",
        align: "center",
      });

      axios
        .post("/lms/create-online-class", param) //back end route from web.php
        .then((response) => {
          l.close();
          app.notifyMe("Class Created", "Successful", "success");
          app.subject_teacher.daily_classrooms.push(
            response.data.daily_classroom
          );
          app.form = app.empty_form;
          app.create_new = false;
        });
    },
    uploadResources(daily_classroom) {
      let app = this;
      app.daily_classroom = daily_classroom;
      app.show_upload_form = true;
    },
    viewStudents(daily_classroom) {
      let app = this;
      app.daily_classroom = daily_classroom;
      const name = "Teacher";
      app.query_string =
        "?open=true&sessionid=" +
        daily_classroom.subject_teacher_id +
        "&publicRoomIdentifier=dashboard&userFullName=" +
        name;
      app.view_students = true;
    },

    deleteClass(index, id) {
      var message = "Are you sure you want to delete this class?";

      if (confirm(message)) {
        let app = this;
        let l = app.$message.loading({
          message: "deleting online class...",
          align: "center",
        });
        axios
          .post("/lms/delete-onlineclass/" + id) //back end route from web.php
          .then((response) => {
            l.close();
            app.subject_teacher.daily_classrooms.splice(index - 1, 1);
            app.notifyMe("Deleted", "Successful", "success");
          });
      }
    },
  },
};
</script>
