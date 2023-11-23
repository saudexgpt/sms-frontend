<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <b-row>
          <b-col
            cols="12"
          >
            <legend>This classroom was scheduled to start at <strong>{{ dailyClassroom.start }}</strong> till <strong>{{ dailyClassroom.end }}</strong> on <strong>{{ moment(dailyClassroom.date).format('ll') }}</strong> </legend>
          </b-col>
        </b-row>
      </div>
      <b-row v-if="dailyClassroom.subject_teacher.class_teacher.online_class_meeting_link === null">
        <b-col cols="12">
          <aside>
            <p>This is the first time to have an online class in {{ `${dailyClassroom.subject_teacher.subject.name} (${dailyClassroom.subject_teacher.class_teacher.c_class.name})` }}, therefore kindly follow the steps below to make subsequent classes easy</p>
            <ol>
              <li>Click on the <code>Fetch Class Link</code> button below</li>
              <li>A new window will open and a Google Meeting Screen will appear</li>
              <li>Copy the Meeting Link by clicking on the <feather-icon icon="CopyIcon" /> Icon</li>
              <li>Come back to this page</li>
              <li>Paste the copied link in the field below</li>
              <li>Click on the <code>SAVE</code> button</li>
            </ol>
            <p>With this saved link, your students will be able to join the class</p>
          </aside>
        </b-col>
        <b-col cols="7">
          <el-input
            v-model="form.online_class_meeting_link"
            placeholder="Paste your meeting link here"
          />
        </b-col>
        <!-- submit and reset -->
        <b-col cols="5">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            @click="updateClassLink()"
          >
            SAVE
          </b-button>
        </b-col>
      </b-row>
      <div>

        <p><strong>We will be linking you up with Google for the class</strong></p>
        <span
          v-if="dailyClassroom.subject_teacher.class_teacher.online_class_meeting_link !== null"
          class="nU false"
        >
          <a
            :href="dailyClassroom.subject_teacher.class_teacher.online_class_meeting_link"
            target="_blank"
            class="btn btn-success"
            title="Start Class"
            aria-label="Start Class"
            draggable="false"
          ><feather-icon icon="VideoIcon" /> Live Video Class</a>
        </span>
        <span
          v-else
          class="nU false"
        >
          <a
            href="https://meet.google.com/new?hs=180&amp;authuser=0"
            target="_blank"
            class="btn btn-warning"
            title="Start Class"
            aria-label="Start Class"
            draggable="false"
          ><feather-icon icon="VideoIcon" /> Fetch Class Link</a>
        </span>
      </div>
    </el-card>
  </div>

</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
import moment from 'moment'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
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
      form: {
        online_class_meeting_link: '',
      },
      loading: false,
      type: 'password',
    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
  },
  methods: {
    moment,
    updateClassLink() {
      const app = this
      const param = app.form
      app.loading = true
      const saveKeyResource = new Resource('lms/update-meeting-link')
      saveKeyResource.update(app.dailyClassroom.subject_teacher.class_teacher.id, param)
        .then(() => {
          app.$alert('Link saved successfully')
          app.$emit('updatelink', param.online_class_meeting_link)
          app.loading = false
        })
    },
    // toggleVisibility() {
    //   const app = this
    //   if (app.type === 'password') {
    //     app.type = 'text'
    //   } else {
    //     app.type = 'password'
    //   }
    // },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
