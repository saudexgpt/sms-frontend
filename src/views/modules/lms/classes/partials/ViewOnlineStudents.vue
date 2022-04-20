<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div class="col-xs-12">
      <!-- <a :href="'http://localhost:9001/live-class/dashboard/canvas-designer.html'+queryString" target="_blank" class="btn btn-success fa fa-video"> Live Video Class</a> -->
      <!-- <a
        :href="'https://liveclass.school-point.com/live-class/dashboard/canvas-designer.html'+queryString"
        target="_blank"
        class="btn btn-success fa fa-video"
      > Live Video Class</a> -->
      <legend>This classroom is scheduled to start at <strong>{{ classroom.start }}</strong> till <strong>{{ classroom.end }}</strong> on <strong>{{ classroom.date }}</strong> </legend>

      <div v-if="can_edit">
        <form @submit.prevent="updateClassNote()">

          <div class="col-md-12">
            <label for="">Type explanations here for students to see. (Note: ONLY TEXT IS ALLOWED)</label>
            <!-- <ckeditor
              v-model="class_note.class_note"
              :editor="editor"
              :config="editorConfig"
            /> -->
            <quill-editor
              v-model="class_note.class_note"
              :options="editorOption"
            />
            <!-- <vue-editor v-model="class_note.class_note" :customModules="customModulesForEditor" :editorOptions="editorSettings" placeholder="Type explanations here for students to see"></vue-editor> -->
            <!-- <textarea class="form-control" rows="5" v-model="class_note.class_note" placeholder="Type explanations here for students to see"></textarea> -->

          </div>

          <div class="col-md-6">
            <p />
            <button
              type="submit"
              class="btn btn-success"
            >
              <i class="fa fa-save" /> Upload
            </button>

          </div>
        </form>

      </div>
      <div v-else>
        <legend align="center">
          Class Board
        </legend>
        <div style="height: 350px; overflow: auto; border: solid #333 3px; padding: 10px;">
          <span v-html="classroom.class_note" />
        </div>

      </div>
      <div>
        <upload-learning-resources
          :daily-classroom="classroom"
          :showform="false"
        />
      </div>

    </div>
    <el-row :gutter="5">
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
      >
        <div class="box box-success">
          <div
            class="box-header ui-sortable-handle"
            style="cursor: move;"
          >
            <i class="fa fa-users" />
            <h3 class="box-title">
              Students in Attendance
            </h3>
          </div>
          <div
            class="slimScrollDiv"
            style="position: relative; overflow: auto; width: auto; height: 300px;"
          >
            <div
              v-if="online_students.length > 0"
              class="box-body"
              style="overflow: auto; width: auto; height: 300px;"
            >
              <!-- chat item -->
              <div
                v-for="(attendee, index) in online_students"
                :key="index"
                class="col-md-3 col-sm-4 col-xs-6"
              >
                <div align="center">
                  <img
                    :src="baseServerUrl + 'storage/'+attendee.user.photo"
                    alt="user image"
                    class="online"
                    width="50"
                  >

                  <p>
                    <strong
                      v-if="attendee.user_id == user_id"
                      class="message"
                    >
                      Me
                    </strong>
                    <strong
                      v-else
                      class="message"
                    >
                      {{ attendee.user.first_name }} {{ attendee.user.last_name }}
                    </strong>
                  </p>
                  <p>Joined on <br>{{ attendee.created_at }}</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="8"
      >
        <div class="box box-success">
          <div
            class="box-header ui-sortable-handle"
            style="cursor: move;"
          >
            <i class="fa fa-comments" />
            <h3 class="box-title">
              Classroom Chats
            </h3>
          </div>
          <div
            class="slimScrollDiv"
            style="position: relative; overflow: auto; width: auto; height: 250px;"
          >
            <div
              id="chat-box"
              class="box-body chat"
              style="overflow: auto; width: auto; height: 250px;"
            >

              <div
                v-for="(classroom_chat, index) in classroom_chats"
                :key="index"
              >
                <div
                  v-if="classroom_chat.user.id == user_id"
                  class="direct-chat-msg right"
                >
                  <div class="direct-chat-info clearfix">
                    <span class="direct-chat-name pull-right">Me</span>
                    <span class="direct-chat-timestamp pull-left">{{ classroom_chat.created_at }}
                      <a @click="deletePost(index, classroom_chat.id)"><i class="fa fa-trash" /></a>
                    </span>
                  </div>
                  <!-- /.direct-chat-info -->
                  <img
                    :src="baseServerUrl + 'storage/'+classroom_chat.user.photo"
                    alt="user image"
                    class="direct-chat-img"
                    width="30"
                  >
                  <!-- /.direct-chat-img -->
                  <div class="direct-chat-text">
                    {{ classroom_chat.post }}
                  </div>
                  <!-- /.direct-chat-text -->
                </div>
                <div
                  v-else
                  class="direct-chat-msg"
                >
                  <div class="direct-chat-info clearfix">
                    <span class="direct-chat-name pull-left">{{ classroom_chat.user.first_name }} {{ classroom_chat.user.last_name }}</span>
                    <span class="direct-chat-timestamp pull-right">{{ classroom_chat.created_at }}

                    </span>
                  </div>
                  <!-- /.direct-chat-info -->

                  <img
                    :src="baseServerUrl + 'storage/'+classroom_chat.user.photo"
                    alt="user image"
                    width="30"
                    class="direct-chat-img"
                  >
                  <!-- /.direct-chat-img -->
                  <div class="direct-chat-text">
                    {{ classroom_chat.post }}
                  </div>
                  <!-- /.direct-chat-text -->
                </div>
                <!-- /.direct-chat-msg -->

                <!-- Message to the right -->

              </div>

            </div>

          </div>
          <!-- /.chat -->
          <div class="box-footer">
            <el-input
              v-model="form.post_chat"
              placeholder="Type message..."
            >
              <el-button
                slot="append"
                @click="savePost()"
              >
                <feather-icon
                  icon="MessageCircleIcon"
                /></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<!--<script src="https://rtcmulticonnection.herokuapp.com/dist/RTCMultiConnection.min.js"></script>
<script src="https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js"></script>-->
<script>
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// eslint-disable-next-line
import 'quill/dist/quill.core.css'
// eslint-disable-next-line
import 'quill/dist/quill.snow.css'
// eslint-disable-next-line
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import UploadLearningResources from './UploadLearningResources-new.vue'
// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-vue'
// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)
import Resource from '@/api/resource'

export default {
  components: { UploadLearningResources, quillEditor },
  props: {
    dailyClassroom: {
      type: Object,
      default: () => ({
        materials: [],
      }),
    },
    queryString: {
      type: String,
      default: () => (''),
    },

  },
  data() {
    return {
      editorOption: {
        theme: 'bubble',
      },
      online_students: [],
      classroom_chats: [],
      user_id: '',
      can_edit: false,
      form: {
        post_chat: '',
        daily_classroom_id: this.dailyClassroom.id,
      },
      classroom: { materials: [] },
      reload: '',
      roomId: 'public-room',
      class_note: {
        class_note: this.dailyClassroom.class_note,
        daily_classroom_id: this.dailyClassroom.id,
      },
      // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
      // editorSettings: {
      //     modules: {
      //     imageDrop: true,
      //     imageResize: {}
      //     }
      // },
      //   editor: ClassicEditor,
      //   editorConfig: {
      //     // The configuration of the editor.
      //   },

    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchOnlineClassStudents()
    this.reload = setInterval(() => {
      this.fetchOnlineClassStudents()
    }, 45000)
  },
  beforeDestroy() {
    clearInterval(this.reload)

    // this.leaveClass()
  },
  methods: {
    leaveClass() {
      const app = this
      const leaveClassResource = new Resource('lms/leave-class')
      leaveClassResource.get(app.classroom.id) // back end route from web.php

        .then(() => {

        })
    },
    fetchOnlineClassStudents() {
      const app = this
      const onlineStudentResource = new Resource('lms/online-class-students')
      onlineStudentResource.get(app.dailyClassroom.id) // back end route from web.php
        .then(response => {
          app.online_students = response.online_students
          app.classroom_chats = response.classroom_chats
          app.classroom = response.classroom
          app.user_id = response.user_id
          app.can_edit = response.can_edit
          app.scrollToEnd()
        })
    },
    savePost() {
      const app = this
      const param = app.form

      if (param.post_chat !== '') {
        const postInOnlineClassResource = new Resource('lms/post-in-online-class')
        postInOnlineClassResource.store(param) // back end route from web.php
          .then(response => {
            app.classroom_chats.push(response.classroom_post)
            app.form.post_chat = ''
            app.scrollToEnd()
            // app.fetchOnlineClassStudents();
          })
      }
    },
    scrollToEnd() {
      const container = this.$el.querySelector('#chat-box')
      container.scrollTop = container.scrollHeight
    },
    deletePost(index, id) {
      const app = this
      const deleteClassroomPostResource = new Resource('lms/delete-classroom-post')
      deleteClassroomPostResource.destroy(id) // back end route from web.php
        .then(() => {
          app.classroom_chats.splice(index, 1)

          app.fetchOnlineClassStudents()
        })
    },
    updateClassNote() {
      const app = this
      const param = app.class_note
      const updateOnlineClassResource = new Resource('lms/update-online-class-note')
      updateOnlineClassResource.store(param) // back end route from web.php
        .then(() => {

        })
    },

  },
}
</script>
