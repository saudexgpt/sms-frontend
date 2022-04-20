<template>
  <el-card>
    <div slot="header">
      <h4>Teacher Time Table</h4>
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

const fetchRoutineResource = new Resource('time-table/teacher/time-table')

export default {
  components: { FullCalendar },
  data() {
    return {
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

        // slotMinTime: '08:00:00', // "07:45:00",
        // slotMaxTime: '18:00:00',
        // slotDuration: '00:10:00',
        events: [],
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
      fetchRoutineResource.list()
        .then(response => {
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
        const teacherName = (routine.subject_teacher.staff) ? `${routine.subject_teacher.staff.user.first_name} ${routine.subject_teacher.staff.user.last_name}` : ''

        const eachEvent = {
          id: routine.id,
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
