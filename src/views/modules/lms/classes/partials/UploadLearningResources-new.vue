<template>
  <el-card v-loading="load">
    <div
      v-if="showform"
      class="box primary"
    >
      <div class="box-header bg-blue">
        <h4 class="box-title">
          Upload Class Materials
        </h4>
        <span class="pull-right">
          <a
            class="btn btn-info"
            @click="upload_type = 'document'"
          >Upload Documents (.pdf or .doc files)</a>
          <a
            class="btn btn-danger"
            @click="upload_type = 'videos'"
          >Upload Videos</a>
          <!-- <a href="create-online-class-video" class="btn btn-danger">Upload Videos</a> -->
        </span>
      </div>
      <div class="box-body">
        <div v-if="upload_type == 'document'">
          <form
            enctype="multipart/form-data"
            @submit.prevent="saveDocument()"
          >
            <div class="col-md-12">
              <label
                for
              >Select additional document to upload (Maximum single file
                upload size is 5MB)</label>
              <input
                type="file"
                class="form-control"
                @change="readDocumentURL"
              >
            </div>

            <div class="col-md-6">
              <p />
              <button
                type="submit"
                class="btn btn-info"
              >
                <i class="fa fa-file" /> Upload Document
              </button>
            </div>
          </form>
        </div>
        <div v-if="upload_type == 'videos'">
          <form
            enctype="multipart/form-data"
            @submit.prevent="saveClassVideo()"
          >
            <div class="col-md-12">
              <input
                v-model="video_form.link"
                class="form-control"
                placeholder="Enter Youtube Video Link"
              >
            </div>
            <!-- <div class="col-md-12">
                            <textarea  v-model="video_form.description" class="form-control" placeholder="Describe video"></textarea>
                        </div>
                        <div class="col-md-12">
                            <label for="">Select Video file to upload</label>
                            <input type="file" v-on:change="readVideoURL" class="form-control">
            </div>-->

            <div class="col-md-6">
              <p />
              <button
                type="submit"
                class="btn btn-danger"
              >
                <i class="fa fa-video" /> Save Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="box primary">
        <div class="box-header bg-blue">
          <h4 class="box-title">
            Uploaded Materials for
            <strong>{{ dailyClassroom.topic }}</strong>
          </h4>
        </div>
        <div
          class="box-body"
          style="height: 450px; overflow: auto"
        >
          <div
            v-for="(material, index) in dailyClassroom.materials"
            :key="index"
          >
            <div
              v-if="material.mime.split('/')[0] == 'image'"
              class="col-md-3 col-sm-6 col-xs-12"
            >
              <div
                class="small-box"
                align="center"
              >
                <a
                  :href="baseServerUrl + 'storage/' + material.file_link"
                  target="_blank"
                >
                  <img
                    :src="baseServerUrl + 'storage/' + material.file_link"
                    alt
                    style="
                      width: 150px;
                      height: 150px;
                      display: block;
                      margin-left: auto;
                      margin-right: auto;
                    "
                  >
                </a>
                <p v-if="showform">
                  <a
                    class="red"
                    @click="deleteMaterial(index, material.id)"
                  >
                    <i class="fa fa-trash" /> Delete
                  </a>
                </p>
              </div>
            </div>
            <!-- <div v-if="material.mime.split('/')[0] == 'video'" class="col-md-3 col-sm-6 col-xs-12">
                        <div class="small-box" align="center">
                            <video style="width: 150px; height: 150px; display: block; margin-left: auto; margin-right: auto" controls controlsList="nodownload" preload="metadata">
                                <source :src="'/storage/'+material.file_link" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <p v-if="showform"> <a @click="deleteMaterial(index, material.id);" class="red"><i class="fa fa-trash"></i> Delete</a> </p>
                        </div>
          </div>-->
            <div
              v-if="material.mime.split('/')[0] == 'application'"
              class="col-md-3 col-sm-6 col-xs-12"
            >
              <div
                class="small-box"
                align="center"
              >
                <a
                  :href="baseServerUrl + 'storage/' + material.file_link"
                  target="_blank"
                >
                  <h4 v-if="material.file_name.split('.')[1] == 'pdf'">
                    <i class="fa fa-file-pdf-o fa-5x" />
                    <!-- <embed :src="'/storage/'+material.file_link" width="500" height="375"> -->
                  </h4>
                  <h4
                    v-else-if="
                      material.file_name.split('.')[1] == 'pptx' ||
                        material.file_name.split('.')[1] == 'ppt'
                    "
                  >
                    <i class="fa fa-file-powerpoint-o fa-5x" />
                  </h4>
                  <h4
                    v-else-if="
                      material.file_name.split('.')[1] == 'doc' ||
                        material.file_name.split('.')[1] == 'docx'
                    "
                  >
                    <i class="fa fa-file-word-o fa-5x" />
                  </h4>
                  <h4 v-else>
                    <i class="fa fa-file fa-5x" />
                  </h4>
                  Download File
                </a>

                <p v-if="showform">
                  <a
                    class="red"
                    @click="deleteMaterial(index, material.id)"
                  >
                    <i class="fa fa-trash" /> Delete
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-8">
      <div class="box primary">
        <div class="box-header bg-blue">
          <h4 class="box-title">
            Uploaded Videos for
            <strong>{{ dailyClassroom.topic }}</strong>
          </h4>
        </div>
        <div
          class="box-body"
          style="height: 450px; overflow: auto"
        >
          <div
            v-for="(video, index) in dailyClassroom.videos"
            :key="index"
            class="col-md-6 col-sm-12 col-xs-12"
          >
            <div align="center">
              <iframe
                :src="'https://www.youtube.com/embed/' + video.param"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />

              <p v-if="showform">
                <a
                  class="btn btn-danger"
                  @click="deleteVideo(index, video.id)"
                >
                  <i class="fa fa-trash" /> Delete
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    dailyClassroom: {
      type: Object,
      default: () => ({
        materials: [],
      }),
    },
    showform: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      upload_type: '',
      media_form: {
        media: null,
        class_note: this.dailyClassroom.class_note,
        daily_classroom_id: this.dailyClassroom.id,
      },
      video_form: {
        media: null,
        class_note: this.dailyClassroom.class_note,
        daily_classroom_id: this.dailyClassroom.id,
        title: '',
        description: '',
        link: '',
      },
      empty_form: {
        media: null,
        class_note: this.dailyClassroom.class_note,
        daily_classroom_id: this.dailyClassroom.id,
        title: '',
        description: '',
      },
      load: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },

  },
  methods: {
    saveDocument() {
      const app = this
      const param = app.media_form
      if (param.media.size > 5120000) {
        // eslint-disable-next-line no-alert
        alert('File size should not exceed 5MB at a time')
      } else {
        const formData = new FormData()
        formData.append('media', param.media)
        formData.append('daily_classroom_id', param.daily_classroom_id)
        formData.append('class_note', param.class_note)
        app.load = true
        const uploadMaterialResource = new Resource('lms/upload-online-class-materials')
        uploadMaterialResource
          .store(formData) // back end route from web.php
          .then(response => {
            app.load = false
            app.$message('Materials Uploaded')
            app.dailyClassroom.materials.push(response.material)
            app.media_form = app.empty_form
          })
      }
    },

    saveClassVideo() {
      const app = this
      const param = app.video_form
      if (param.link !== '') {
        //   let formData = new FormData();
        //   formData.append("video", param.media);
        //   formData.append("daily_classroom_id", param.daily_classroom_id);
        //   formData.append("link", param.link);
        //   formData.append("description", param.description);
        app.load = true
        const uploadMaterialResource = new Resource('lms/upload-online-class-video')
        uploadMaterialResource
          .store(param) // back end route from web.php
          .then(response => {
            app.load = false
            app.$message('Video Uploaded')
            app.dailyClassroom.videos.push(
              response.daily_class_room_video,
            )
            app.video_form = app.empty_form
          })
      } else {
        // eslint-disable-next-line no-alert
        alert('Please enter a valid Youtube Video link')
      }
    },

    readDocumentURL(input) {
      const app = this

      const file = input.target.files[0]

      app.media_form.media = file
    },
    readVideoURL(input) {
      const app = this

      const file = input.target.files[0]

      app.video_form.media = file
    },

    deleteMaterial(index, id) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Confirm Delete Action. This cannot be undone')) {
        const app = this
        app.load = true
        const deleteMaterialResource = new Resource('lms/delete-onlineclass-material')
        deleteMaterialResource
          .destroy(id) // back end route from web.php
          .then(() => {
            app.load = false
            app.dailyClassroom.materials.splice(index, 1)
            app.$message('Deleted')
          })
      }
    },
    deleteVideo(index, id) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Confirm Delete Action. This cannot be undone')) {
        const app = this
        app.load = true
        const deleteMaterialResource = new Resource('lms/delete-onlineclass-video')
        deleteMaterialResource
          .destroy(id) // back end route from web.php
          .then(() => {
            app.load = false
            app.dailyClassroom.videos.splice(index, 1)
            app.$message('Deleted')
          })
      }
    },
  },
}
</script>
