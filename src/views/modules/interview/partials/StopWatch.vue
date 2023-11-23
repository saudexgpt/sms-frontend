<style>
.countdown {
  margin: 0 auto;
  max-width: 350px;
  font-family: Impact, Charcoal, sans-serif;
  text-align: center;
}

.countdown .square {
  display: inline-block;
  padding: 2px;
  margin: 1px;
}

.countdown .digits {
  font-size: 24px;

  color: rgb(6, 105, 27);
  padding: 5px 5px;
  border-radius: 5px;
}

.countdown2 .digits {
  font-size: 24px;

  color: #c61d1d;
  padding: 5px 5px;
  border-radius: 5px;
}
.countdown .text {
  margin-top: 5px;
  color: #203769;
}

</style>
<template>
  <div>
    <div v-if="timeup">
      <div class="countdown countdown2">
        <div class="square">
          <span class="digits">00  :</span>
          <div class="text">
            Hrs
          </div>
        </div>
        <div class="square">
          <span class="digits">00  :</span>
          <div class="text">
            Mins
          </div>
        </div>
        <div class="square">
          <span class="digits">00</span>
          <div class="text">
            Secs
          </div>
        </div>
        <!--<font size=2><?= $time_up_message;?></font>-->

      </div>
    </div>
    <div v-else>
      <div class="countdown">
        <!--<font size=2 > <?= $time_on_message;?></font>-->

        <div class="square">
          <span class="digits">{{ hours }}  :</span>
          <div class="text">
            Hrs
          </div>
        </div>
        <div class="square">
          <span class="digits">{{ minutes }}  :</span>
          <div class="text">
            Mins
          </div>
        </div>
        <div class="square">
          <span class="digits">{{ seconds }}</span>
          <div class="text">
            Secs
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Resource from '@/api/resource'

const updateRemainingTimeResource = new Resource('interview/update-remaining-time')
export default {
  props: {
    quizAttempt: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      updateInterval: 0,
      total: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timeup: false,
      timeinterval: null,
    }
  },
  created() {
    const app = this
    // this.countDownTimer()
    // $time_frame;//new Date("<?=$time_frame;?>").getTime()
    setTimeout(app.initializeClock(), 1000)
  },
  beforeDestroy() {
    clearInterval(this.timeinterval)
  },
  methods: {

    initializeClock() {
      const app = this

      // app.duration*1000;
      let deadline = app.quizAttempt.remaining_time
      // app.updateClock(deadline);

      app.timeinterval = setInterval(() => {
        if (deadline > 0) {
          deadline -= 1
          app.updateClock(deadline)
          // eslint-disable-next-line no-plusplus
          app.updateInterval++
        }
      }, 1000)

      // console.log(timeinterval)
      // var timeinterval = setInterval(
      //                     this.updateClock(endtime), 1000);
    },
    updateClock(deadline) {
      const app = this

      const t = app.getTimeRemaining(deadline)

      // daysSpan.innerHTML = ('0' + t.days).slice(-2);
      app.hours = (`0${t.hours}`).slice(-2)
      app.minutes = (`0${t.minutes}`).slice(-2)
      app.seconds = (`0${t.seconds}`).slice(-2)

      if (app.updateInterval >= 10) {
        app.updateInterval = 0
        app.updateQuizRemainingTime(deadline)
      }

      if (t.total <= 0) {
        app.updateQuizRemainingTime(deadline)
        app.timeup = true
        app.$emit('timeup', app.timeup)
        // loadAjax('stop_watch_with_includes.php','#clock','#flashDiv','TIME UP!!!');
        // var message = 'Time_up';
        // preview(edit);
        // submitExam(message);
      }
    },
    getTimeRemaining(deadline) {
      const t = deadline * 1000// app.duration*1000;//countDownDate - now;

      const seconds = Math.floor((t / 1000) % 60)
      const minutes = Math.floor((t / 1000 / 60) % 60)
      const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
      // alert (hours);
      // var days = Math.floor(t / (1000 * 60 * 60 * 24));
      return {
        total: t,
        // 'days': days,
        hours,
        minutes,
        seconds,
      }
    },
    updateQuizRemainingTime(time) {
      const app = this
      // const param = `?id=${app.quizAttempt.id}&rt=${time}`
      const param = {
        id: app.quizAttempt.id,
        rt: time,
      }
      updateRemainingTimeResource.store(param) // back end route from web.php

        .then(response => {
          console.log(response)
        })
    },

  },

}
</script>
