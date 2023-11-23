/* eslint-disable no-multiple-empty-lines */
<template>
  <el-card>

    <div
      slot="header"
      class="clearfix"
    >
      <b-button
        v-if="checkPermission(['can manage news and events'])"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        aria-controls="sidebar-add-new-event"
        variant="primary"
        class="pull-right"
        @click="isEventHandlerSidebarActive = true"
      >
        Add Event
      </b-button>
      <h4>Notice Board</h4>
    </div>
    <br>
    <el-timeline
      v-loading="load"
      style="padding: 20px;"
    >
      <el-timeline-item
        v-for="(eachEvent, index) in events"
        :key="index"
        :timestamp="'Posted ' + moment(eachEvent.created_at).fromNow()"
        placement="top"
        color="#0bbd87"
      >
        <el-card>
          <div>
            <strong>
              {{ eachEvent.title }}

              <el-button
                v-if="checkPermission(['can manage news and events'])"
                class="pull-right"
                type="danger"
                icon="el-icon-delete"
                round
                size="mini"
                @click="removeRoutine(eachEvent)"
              />
            </strong>
          </div>
          <small v-if="eachEvent.start === eachEvent.end"><i class="el-icon-date" /> {{ moment(eachEvent.start).format('ll') }}</small>
          <small v-else><i class="el-icon-date" /> {{ moment(eachEvent.start).format('ll') }} <i class="el-icon-right" /> {{ moment(eachEvent.end).format('ll') }}</small>
          <br><br>
          <p>{{ eachEvent.description }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <!-- <full-calendar
          ref="refCalendar"
          :options="calendarOptions"
          class="full-calendar"
        /> -->
    <!-- <el-col
        v-if="checkPermission(['can manage news and events'])"
        :lg="4"
        :md="4"
        :sm="4"
        :xs="4"
      >
        <div
          id="calendarTrash"
          align="center"
          style="position: fixed"
        >
          <img src="@/assets/images/trash.png">
          <p>DRAG EVENTS HERE TO DELETE</p>
        </div>
      </el-col> -->

    <!-- Sidebar Overlay -->
    <!-- <div
        class="body-content-overlay"
        :class="{'show': isCalendarOverlaySidebarActive}"
        @click="isCalendarOverlaySidebarActive = false"
      /> -->
    <calendar-event-handler
      v-model="isEventHandlerSidebarActive"
      :event-data="event"
      @remove-event="removeEvent"
      @saved="addEvent"
      @updated="updateEvent"
    />
  </el-card>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
import moment from 'moment'
import Ripple from 'vue-ripple-directive'
// import FullCalendar from '@fullcalendar/vue'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import listPlugin from '@fullcalendar/list'
import checkPermission from '@/utils/permission'
// import CalendarSidebar from './calendar-sidebar/CalendarSidebar.vue'
import Resource from '@/api/resource'
import CalendarEventHandler from './calendar-event-handler/CalendarEventHandler.vue'

export default {
  directives: {
    Ripple,
  },
  components: {
    BButton,
    // FullCalendar, // make the <FullCalendar> tag available
    // CalendarSidebar,
    CalendarEventHandler,
  },
  data() {
    // const app = this
    return {
      events: [],
      isEventHandlerSidebarActive: false,
      // calendarOptions: {
      //   plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      //   headerToolbar: {
      //     left: 'prev,next today',
      //     center: 'title',
      //     right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      //   },
      //   initialView: 'dayGridMonth',
      //   dateClick: this.handleDateClick,
      //   editable: true,
      //   eventResizableFromStart: false,
      //   events: [],
      //   // eventResize(info) {
      //   //   // eslint-disable-next-line no-underscore-dangle
      //   //   const event = info.event._instance.range
      //   //   // eslint-disable-next-line no-underscore-dangle
      //   //   const id = info.event._def.publicId
      //   //   const { start } = event
      //   //   const { end } = event
      //   //   // console.log(info.event)
      //   //   renderRoutine(id, start, end, start)
      //   // },
      //   eventDrop(info) {
      //     app.removeRoutine(info.event)
      //   },
      //   eventClick(info) {
      //     app.showDetails(info.event)
      //   },
      //   eventDragStop(info) {
      //     const trashEl = document.getElementById('calendarTrash') // jQuery('#calendarTrash')
      //     const { jsEvent } = info
      //     const { event } = info
      //     // console.log(trashEl)
      //     // console.log(info)

      //     const x1 = trashEl.offsetLeft
      //     const x2 = x1 + trashEl.offsetWidth
      //     const y1 = trashEl.offsetTop
      //     const y2 = y1 + trashEl.offsetHeight
      //     // console.log(x1)
      //     // console.log(x2)
      //     // console.log(y1)
      //     // console.log(y2)
      //     // console.log(jsEvent.pageX)
      //     // console.log(jsEvent.pageY)
      //     if (jsEvent.x >= x1 && jsEvent.x <= x2 && jsEvent.y >= y1 && jsEvent.y <= y2) {
      //       app.removeRoutine(event)
      //     }
      //   },
      // },
      load: false,
      event: {},
    }
  },
  created() {
    this.fetchEvents()
  },
  methods: {
    moment,
    checkPermission,
    removeRoutine(event) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this information?')) {
        const deleteEventResource = new Resource('events/delete')
        app.load = true
        deleteEventResource.destroy(event.id).then(() => {
          // event.remove()
          this.fetchEvents()
          app.load = false
        })
      }
    },
    showDetails(event) {
      // console.log(event.extendedProps)
      const { description } = event.extendedProps
      const { title } = event
      this.$alert(description, title, {
        confirmButtonText: 'Close',
      })
    },
    removeEvent(arg) {
      console.log(arg)
    },
    addEvent(events) {
      this.setEvents(events)
      this.isEventHandlerSidebarActive = false
    },
    updateEvent(events) {
      this.setEvents(events)
      this.isEventHandlerSidebarActive = false
    },
    fetchEvents() {
      const app = this
      const eventsResource = new Resource('events')
      app.load = true
      eventsResource.list()
        .then(response => {
          app.events = response.events
          // app.setEvents(response.events)
          app.load = false
        })

      // console.log(events)
    },
    setEvents(routines) {
      const app = this
      const events = []
      routines.forEach(routine => {
        const eachEvent = {
          id: routine.id,
          title: routine.title,
          description: routine.description,
          start: routine.start,
          end: routine.end,
          startTime: routine.start,
          endTime: routine.end,
          // backgroundColor: routine.subject_teacher.subject.color_code,
          textColor: 'white',
          borderColor: 'white',
          // daysOfWeek: [routine.day],
          // allDay: false,
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
