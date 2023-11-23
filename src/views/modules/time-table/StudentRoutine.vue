<template>
  <el-card>
    <div slot="header">
      <h4>Class Time Table</h4>
      <el-alert
        v-if="joinClass"
        :closable="false"
        type="info"
      >
        Click on a subject to join an online class
      </el-alert>
    </div>
    <full-calendar
      ref="refCalendar"
      :options="calendarOptions"
      class="full-calendar"
    />
  </el-card>
</template>
<script>
// import { BFormGroup, BTime, BButton } from 'bootstrap-vue'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
// import CreateRoutineModal from './partials/CreateRoutineModal.vue'
import Resource from '@/api/resource'

const fetchClassRoutineResource = new Resource('time-table/student/class-time-table')

export default {
  components: { FullCalendar },
  props: {
    studentId: {
      type: Number,
      default: () => (0),
    },
    joinClass: {
      type: Boolean,
      default: () => (false),
    },
  },
  data() {
    function startClass(link) {
      window.open(link, '_blank')
    }
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        headerToolbar: {
          // left: 'prev,next',
          // center: 'title',
          // right: 'timeGridWeek,timeGridDay,listWeek',
          left: '',
          center: '',
          right: '',
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
            startClass(link)
          } else {
            // eslint-disable-next-line no-alert
            window.alert('Your online class link is missing. Kindly inform your teacher')
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
    setTimeTableDetails() {
      const app = this
      app.load = true
      let param = ''
      if (app.studentId !== 0) {
        param = { student_id: app.studentId }
      }
      fetchClassRoutineResource.list(param)
        .then(response => {
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
        const teacherName = (routine.subject_teacher.staff) ? `${routine.subject_teacher.staff.user.first_name} ${routine.subject_teacher.staff.user.last_name}` : ''

        const eachEvent = {
          id: routine.id,
          onlineClassLink: (routine.subject_teacher.staff) ? routine.subject_teacher.staff.online_class_meeting_link : null,
          title: `${routine.subject_teacher.subject.name} by ${teacherName}`,
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
