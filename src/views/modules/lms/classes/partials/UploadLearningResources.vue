<template>
  <div>
    <div
      v-if="showform"
      class="box primary"
    >
      <div class="box-header bg-blue">
        <h4 class="box-title">
          Upload Class Materials
        </h4>
      </div>
      <div class="box-body">
        <form
          enctype="multipart/form-data"
          @submit.prevent="saveClassMaterial()"
        >
          <div class="col-md-12">
            <label for="">Select class material to upload (Maximum single file upload size is 5MB)</label>
            <input
              type="file"
              class="form-control"
              @change="readURL"
            >
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
    </div>

    <div class="box primary">
      <div class="box-header bg-blue">
        <h4 class="box-title">
          Uploaded Materials for <strong>{{ daily_classroom.topic }}</strong>
        </h4>
      </div>
      <div class="box-body">
        <div
          v-for="(material, index) in daily_classroom.materials"
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
                :href="'/storage/'+material.file_link"
                target="_blank"
              >
                <img
                  :src="'/storage/'+material.file_link"
                  alt=""
                  style="width: 150px; height: 150px; display: block; margin-left: auto; margin-right: auto"
                >
              </a>
              <p v-if="showform">
                <a
                  class="red"
                  @click="deleteMaterial(index, material.id);"
                ><i class="fa fa-trash" /> Delete</a>
              </p>
            </div>
          </div>
          <div
            v-if="material.mime.split('/')[0] == 'video'"
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <div
              class="small-box"
              align="center"
            >
              <video
                style="width: 150px; height: 150px; display: block; margin-left: auto; margin-right: auto"
                controls
              >
                <source
                  :src="'/storage/'+material.file_link"
                  type="video/mp4"
                >
                Your browser does not support the video tag.
              </video>
              <p v-if="showform">
                <a
                  class="red"
                  @click="deleteMaterial(index, material.id);"
                ><i class="fa fa-trash" /> Delete</a>
              </p>
            </div>
          </div>
          <div
            v-if="material.mime.split('/')[0] == 'application'"
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <div
              class="small-box"
              align="center"
            >
              <a
                :href="'/storage/'+material.file_link"
                target="_blank"
              >

                <h4 v-if="material.file_name.split('.')[1] == 'pdf'"><i class="fa fa-file-pdf-o fa-5x" /></h4>
                <h4 v-else-if="material.file_name.split('.')[1] == 'pptx' || material.file_name.split('.')[1] == 'ppt'"><i class="fa fa-file-powerpoint-o fa-5x" /></h4>
                <h4 v-else-if="material.file_name.split('.')[1] == 'doc' || material.file_name.split('.')[1] == 'docx'"><i class="fa fa-file-word-o fa-5x" /></h4>
                <h4 v-else><i class="fa fa-file fa-5x" /></h4>

                Download File</a>
              <p v-if="showform">
                <a
                  class="red"
                  @click="deleteMaterial(index, material.id);"
                ><i class="fa fa-trash" /> Delete</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
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
      default: () => (false),
    },

  },
  data() {
    return {

      media_form: {
        media: null,
        daily_classroom_id: this.daily_classroom.id,

      },
      empty_form: {
        media: null,
        daily_classroom_id: this.daily_classroom.id,

      },

    }
  },
  methods: {
    saveClassMaterial() {
      const app = this
      const param = app.media_form
      if (param.media.size > 5120000) {
        app.$alert('File size should not exceed 5MB at a time')
      } else {
        const formData = new FormData()
        formData.append('media', param.media)
        formData.append('daily_classroom_id', param.daily_classroom_id)
        app.load = true
        const uploadMaterialResource = new Resource('lms/upload-online-class-materials')
        uploadMaterialResource.store(formData) // back end route from web.php
          .then(response => {
            app.load = true
            app.notifyMe('Materials Uploaded', 'Successful', 'success')
            app.daily_classroom.materials.push(response.material)
            app.media_form = app.empty_form
          })
      }
    },

    readURL(input) {
      const app = this

      const file = input.target.files[0]

      app.media_form.media = file
    },

    deleteMaterial(index, id) {
      const app = this
      const l = app.$message.loading({
        message: 'deleting material...',
        align: 'center',

      })
      axios.post(`/lms/delete-onlineclass-material/${id}`) // back end route from web.php
        .then(response => {
          l.close()
          app.daily_classroom.materials.splice(index, 1)
          app.notifyMe('Deleted', 'Successful', 'success')
        })
    },

  },
}
</script>
