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

          <div v-if="subject_teachers.length > 0">
            <b-form-group
              label="Select Subject"
              label-for="v-class"
            >
              <el-select
                v-model="form.subject_teacher_id"
                placeholder="Select Subject"
                class="span"
                style="width: 100%;"
                filterable
              >
                <el-option
                  v-for="(subject_teacher, index) in subject_teachers"
                  :key="index"
                  :value="subject_teacher.id"
                  :label="subject_teacher.subject.name"
                >
                  <span style="float: left">{{ subject_teacher.subject.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">&nbsp;&nbsp;by {{ (subject_teacher.staff) ? subject_teacher.staff.user.first_name + ' ' + subject_teacher.staff.user.last_name + ')' : '' }}</span>
                </el-option>
              </el-select>
            </b-form-group>

            <b-form-group
              label="Select Day"
              label-for="v-class"
            >
              <el-select
                v-model="form.day"
                placeholder="Select Day"
                class="span"
                style="width: 100%;"
              >
                <el-option
                  v-for="(day, index) in days"
                  :key="index"
                  :value="day.value"
                  :label="day.label"
                />

              </el-select>
            </b-form-group>

            <b-form-group
              label="Start Time"
              label-for="v-class"
            >
              <b-time
                v-model="form.start"
                locale="en"
                style="width: 100%;"
              />
            </b-form-group>

            <b-form-group
              label="End Time"
              label-for="v-class"
            >
              <b-time
                v-model="form.end"
                locale="en"
                style="width: 100%;"
              />
            </b-form-group>
            <b-form-group>
              <hr>
              <b-button
                :disabled="form.end === ''"
                variant="primary"
                @click="saveRoutine()"
              >
                Submit
              </b-button>
            </b-form-group>
          </div>
        </aside>
        <!-- <b-img :src="require('@/assets/images/pages/calendar-illustration.png')" /> -->
      </div>
      <!-- Calendar -->
      <div
        v-loading="load"
        class="col position-relative"
      >
        <div class="card shadow-none border-0 mb-0 rounded-0">

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
import { BFormGroup, BTime, BButton } from 'bootstrap-vue'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
// import CreateRoutineModal from './partials/CreateRoutineModal.vue'
import Resource from '@/api/resource'

const timeTableResource = new Resource('time-table/fetch-classes')
const storeRoutineResource = new Resource('time-table/store')
const updateRoutineResource = new Resource('time-table/update')
const fetchClassRoutineResource = new Resource('time-table/fetch-class-routine')
const deleteClassRoutineResource = new Resource('time-table/destroy')

export default {
  components: {
    BFormGroup, BTime, BButton, FullCalendar, /* CreateRoutineModal, */
  },
  data() {
    function renderRoutine(id, start, end, day) {
      const param = {
        id, start, end, day,
      }
      updateRoutineResource.store(param).then(() => {})
    }
    function removeRoutine(id) {
      deleteClassRoutineResource.destroy(id).then(() => {})
    }
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay,listWeek',
        },
        initialView: 'timeGridWeek',
        // dateClick: this.handleDateClick,
        weekends: false,
        editable: true,
        eventResizableFromStart: true,

        slotMinTime: '08:00:00', // "07:45:00",
        slotMaxTime: '18:00:00',
        slotDuration: '00:10:00',
        events: [],
        eventResize(info) {
          // eslint-disable-next-line no-underscore-dangle
          const event = info.event._instance.range
          // eslint-disable-next-line no-underscore-dangle
          const id = info.event._def.publicId
          const { start } = event
          const { end } = event
          // console.log(info.event)
          renderRoutine(id, start, end, start)
        },
        eventDrop(info) {
          // eslint-disable-next-line no-underscore-dangle
          const event = info.event._instance.range
          // eslint-disable-next-line no-underscore-dangle
          const id = info.event._def.publicId
          const { start } = event
          const { end } = event
          // console.log(info.event)
          renderRoutine(id, start, end, start)
        },
        eventClick(info) {
          // eslint-disable-next-line no-underscore-dangle
          const id = info.event._def.publicId
          // info.event.remove()
          // eslint-disable-next-line no-alert
          if (window.confirm('Are you sure you want to delete this schedule?')) {
            removeRoutine(id)
            info.event.remove()
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
    saveRoutine() {
      const app = this
      const param = app.form
      app.load = true
      storeRoutineResource.store(param)
        .then(response => {
          if (response.message === 'busy') {
            app.$alert('This teacher is busy at this time')
          } else {
            const classTeacher = response.class_teacher
            const { routines } = classTeacher
            app.setEvents(routines)
          }
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
