<template>
  <div class="app-calendar border">
    <div class="row no-gutters">
      <!-- Sidebar -->
      <div
        class="col app-calendar-sidebar flex-grow-0 d-flex flex-column"
      >
        <aside>
          <b-form-group
            label="Select Class"
            label-for="v-class"
          >
            <el-select
              v-model="selected_class_id"
              placeholder="Select Class"
              class="span"
              style="width: 100%;"
              filterable
              @change="setTimeTableDetails()"
            >
              <el-option
                v-for="(class_teacher, index) in class_teachers"
                :key="index"
                :value="class_teacher.id"
                :label="class_teacher.c_class.name"
              />

            </el-select>
          </b-form-group>
        </aside>
        <!-- <b-img :src="require('@/assets/images/pages/calendar-illustration.png')" /> -->
      </div>
      <!-- Calendar -->
      <div
        v-loading="load"
        class="col position-relative"
      >
        <div class="card shadow-none border-0 mb-0 rounded-0">
          <el-alert

            v-if="selected_class_id !== ''"
            :closable="false"
            type="warning"
            effect="dark"
          >
            <h3>Click on a subject to join an online class</h3>
          </el-alert>
          <div class="card-body pb-0">
            <full-calendar
              ref="refCalendar"
              :options="calendarOptions"
              class="full-calendar"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar Overlay -->
      <!-- <div
        class="body-content-overlay"
        :class="{'show': isCalendarOverlaySidebarActive}"
        @click="isCalendarOverlaySidebarActive = false"
      />
      <create-routine-modal
        v-model="isEventHandlerSidebarActive"
        :event="event"
        :clear-event-data="clearEventData"
        @remove-event="removeEvent"
        @add-event="addEvent"
        @update-event="updateEvent"
      /> -->
    </div>
  </div>
</template>

<script>
import { BFormGroup } from 'bootstrap-vue'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
// import CreateRoutineModal from './partials/CreateRoutineModal.vue'
import Resource from '@/api/resource'

const timeTableResource = new Resource('time-table/fetch-classes')
const fetchClassRoutineResource = new Resource('time-table/fetch-class-routine')

export default {
  components: {
    BFormGroup, FullCalendar, /* CreateRoutineModal, */
  },
  data() {
    function startClass(link) {
      window.open(link, '_blank')
    }
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        headerToolbar: {
          // left: 'prev,next today',
          // center: 'title',
          right: 'timeGridWeek,timeGridDay,listWeek',
        },
        initialView: 'listWeek',
        // dateClick: this.handleDateClick,
        weekends: false,
        editable: true,
        eventResizableFromStart: true,

        slotMinTime: '08:00:00', // "07:45:00",
        slotMaxTime: '19:00:00',
        slotDuration: '00:30:00',
        events: [],
        eventClick(info) {
          // eslint-disable-next-line no-underscore-dangle
          const link = info.event._def.extendedProps.onlineClassLink
          // eslint-disable-next-line no-underscore-dangle
          const { teacherName } = info.event._def.extendedProps
          if (link !== null) {
            startClass(link)
          } else {
            // eslint-disable-next-line no-alert
            window.alert(`Online Class Workspace is yet to be setup by ${teacherName}`)
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
      days: [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
      ],
    }
  },
  created() {
    this.fetchClassTeachers()
  },
  methods: {
    handleDateClick(arg) {
      console.log(arg)
    },
    fetchClassTeachers() {
      const app = this
      timeTableResource.list()
        .then(response => {
          app.class_teachers = response.class_teachers
        })
    },
    setTimeTableDetails() {
      const app = this
      const classTeacherId = app.selected_class_id
      app.load = true
      fetchClassRoutineResource.get(classTeacherId)
        .then(response => {
          const classTeacher = response.class_teacher
          const { routines } = classTeacher
          app.form.class_teacher_id = classTeacher.id
          app.form.subject_teacher_id = classTeacher.subject_teachers[0].id
          app.subject_teachers = classTeacher.subject_teachers
          app.setEvents(routines)
          app.load = false
        })

      // console.log(events)
    },
    setEvents(routines) {
      const app = this
      const events = []
      routines.forEach(routine => {
        if (routine.subject_teacher) {
          const teacherName = (routine.subject_teacher.staff) ? `${routine.subject_teacher.staff.user.first_name} ${routine.subject_teacher.staff.user.last_name}` : 'No assigned teacher'

          const eachEvent = {
            id: routine.id,
            onlineClassLink: (routine.subject_teacher.staff) ? routine.subject_teacher.staff.online_class_meeting_link : null,
            teacherName: `${teacherName}`,
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
        }
      })
      app.calendarOptions.events = events
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
</style>
