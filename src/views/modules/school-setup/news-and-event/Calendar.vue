<template>
  <div class="app-calendar overflow-hidden border">
    <div class="row no-gutters">
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        aria-controls="sidebar-add-new-event"
        variant="primary"
        block
        @click="isEventHandlerSidebarActive = true"
      >
        Add Event
      </b-button>
      <!-- Sidebar -->
      <!-- <div
        class="col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column"
        :class="{'show': isCalendarOverlaySidebarActive}"
      >
        <calendar-sidebar :is-event-handler-sidebar-active.sync="isEventHandlerSidebarActive" />
      </div> -->
      <!-- Calendar -->
      <div class="col-12">
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
      /> -->
      <calendar-event-handler
        v-model="isEventHandlerSidebarActive"
        :event="event"
        :clear-event-data="clearEventData"
        @remove-event="removeEvent"
        @add-event="addEvent"
        @update-event="updateEvent"
      />
    </div>
  </div>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import FullCalendar from '@fullcalendar/vue'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import calendarStoreModule from './calendarStoreModule'
// import CalendarSidebar from './calendar-sidebar/CalendarSidebar.vue'
import CalendarEventHandler from './calendar-event-handler/CalendarEventHandler.vue'
import useCalendar from './useCalendar'

export default {
  directives: {
    Ripple,
  },
  components: {
    BButton,
    FullCalendar, // make the <FullCalendar> tag available
    // CalendarSidebar,
    CalendarEventHandler,
  },
  setup() {
    const CALENDAR_APP_STORE_MODULE_NAME = 'calendar'

    // Register module
    if (!store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.registerModule(CALENDAR_APP_STORE_MODULE_NAME, calendarStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.unregisterModule(CALENDAR_APP_STORE_MODULE_NAME)
    })

    const {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      fetchEvents,
      refetchEvents,
      calendarOptions,

      // ----- UI ----- //
      isEventHandlerSidebarActive,
    } = useCalendar()

    fetchEvents()

    return {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      refetchEvents,
      calendarOptions,

      // ----- UI ----- //
      isEventHandlerSidebarActive,
    }
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
</style>
