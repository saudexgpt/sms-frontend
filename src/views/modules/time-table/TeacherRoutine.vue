<template>
  <el-card>
    <div slot="header">
      <h4>My Subject Schedule</h4>
      <el-alert
        :closable="false"
        type="info"
      >
        Click on a subject to start an online class
      </el-alert>
    </div>
    <div
      v-if="staff.online_class_meeting_link === null && viewType ==='online_class'"
      class="card shadow-none border-0 p-1 rounded-0"
    >
      <b-row>
        <b-col cols="12">
          <p>You need to setup your <strong>Online Class</strong> workspace. Kindly follow the steps below to do so</p>
          <ol>
            <li>Click on the <code>Fetch Class Link</code> button below</li>
            <li>A new window will open and a Google Meeting Screen will appear</li>
            <li>Copy the Meeting Link by clicking the <feather-icon icon="CopyIcon" /> Icon on that page (as shown in the image below)</li>
            <li>Come back to this page</li>
            <li>Paste the copied link in the field below</li>
            <li>Click on the <code>SAVE</code> button</li>
          </ol>
          <img
            src="/google-meeting-demo.png"
            alt="Demo"
          >
          <p>With the saved link, your students will be able to have online classes with you</p>
          <strong>Kindly note that you will be required to sign-in to a google account on this particular browser (if you have not done so)</strong>
          <p>
            <span>
              <a
                href="https://meet.google.com/new?hs=180&amp;authuser=0"
                target="_blank"
                class="btn btn-warning"
                title="Start Class"
                aria-label="Start Class"
                draggable="false"
              ><feather-icon icon="VideoIcon" /> Fetch Class Link</a>
            </span>
          </p>
        </b-col>
        <b-col cols="7">
          <el-input
            v-model="online_class_meeting_link"
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
    </div>
    <full-calendar
      v-else
      ref="refCalendar"
      :options="calendarOptions"
      class="full-calendar"
    />
  </el-card>
</template>
<script>
import { BButton, BRow, BCol } from 'bootstrap-vue'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
// import CreateRoutineModal from './partials/CreateRoutineModal.vue'
import Resource from '@/api/resource'

const fetchRoutineResource = new Resource('time-table/teacher/time-table')

export default {
  components: {
    BButton, BRow, BCol, FullCalendar,
  },
  props: {
    viewType: {
      type: String,
      required: true,
    },
  },
  data() {
    function startClass(link) {
      window.open(link, '_blank')
    }
    return {
      online_class_meeting_link: '',
      staff: '',
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        headerToolbar: {
          // left: 'prev,next',
          // center: 'title',
          right: 'timeGridWeek,timeGridDay,listWeek',
          left: '',
          center: '',
        },
        initialView: 'listWeek',
        // dateClick: this.handleDateClick,
        weekends: false,
        // editable: true,
        // eventResizableFromStart: true,

        slotMinTime: '08:00:00', // "07:45:00",
        slotMaxTime: '19:00:00',
        slotDuration: '00:30:00',
        events: [],
        eventClick(info) {
          // eslint-disable-next-line no-underscore-dangle
          const link = info.event._def.extendedProps.onlineClassLink
          if (link !== null) {
            // eslint-disable-next-line no-alert
            if (window.confirm('Do you want to start an online class? Click OK to confirm')) {
              startClass(link)
            }
          } else {
            // eslint-disable-next-line no-alert
            window.alert('Kindly setup your Online Class Workspace under Academics >> Classroom Menu')
          }
        },
      },
      load: false,
      selected_class_id: '',
      class_teachers: [],
      subject_teachers: [],
      form: {
        class_teacher_id: '',
        subject_teacher_id: '',
        start: '',
        end: '',
        day: '',
      },
    }
  },
  created() {
    this.setTimeTableDetails()
  },
  methods: {
    handleDateClick(arg) {
      console.log(arg)
    },
    updateClassLink() {
      const app = this
      const param = { online_class_meeting_link: app.online_class_meeting_link }
      app.load = true
      const saveKeyResource = new Resource('lms/update-meeting-link')
      saveKeyResource.update(app.staff.id, param)
        .then(() => {
          app.$alert('Link saved successfully. Your Online Class Workspace with Google is set')
          app.setTimeTableDetails()
          app.load = false
        })
    },
    setTimeTableDetails() {
      const app = this
      app.load = true
      fetchRoutineResource.list()
        .then(response => {
          app.staff = response.staff
          // const classTeacher = response.class_teacher
          const { routines } = response
          // app.form.class_teacher_id = classTeacher.id
          // app.form.subject_teacher_id = classTeacher.subject_teachers[0].id
          // app.subject_teachers = classTeacher.subject_teachers
          app.setEvents(routines)
          app.load = false
        })

      // console.log(events)
    },
    setEvents(routines) {
      const app = this
      const events = []
      routines.forEach(routine => {
        const className = (routine.subject_teacher.class_teacher) ? `${routine.subject_teacher.class_teacher.c_class.name}` : ''

        const eachEvent = {
          id: routine.id,
          onlineClassLink: (routine.subject_teacher.staff) ? routine.subject_teacher.staff.online_class_meeting_link : null,
          title: `${routine.subject_teacher.subject.name} (${className})`,
          start: routine.start,
          end: routine.end,
          startTime: routine.start,
          endTime: routine.end,
          backgroundColor: routine.subject_teacher.subject.color_code,
          textColor: 'white',
          borderColor: 'white',
          daysOfWeek: [routine.day],
          allDay: false,
        }
        events.push(eachEvent)
      })
      app.calendarOptions.events = events
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
</style>
