<template>
  <span class="timespinner">
    <span class="timespinner-slot">
      <span class="timespinner-slot-arrow iconfont icon-up" v-repeat-click="handleClick('hours')"></span>
      <span class="timespinner-slot-arrow bottom iconfont icon-down" v-repeat-click="handleClick('hours', '+')"></span>
      <input class="timespinner-editor" lazy number v-model="hours" />
    </span>
    <span class="timespinner-separator">:</span>
    <span class="timespinner-slot">
      <span class="timespinner-slot-arrow iconfont icon-up" v-repeat-click="handleClick('minutes')"></span>
      <span class="timespinner-slot-arrow bottom iconfont icon-down" v-repeat-click="handleClick('minutes', '+')"></span>
      <input class="timespinner-editor" lazy number v-model="minutes" />
    </span>
    <span class="timespinner-separator" v-if="showSeconds">:</span>
    <span class="timespinner-slot" v-if="showSeconds">
      <span class="timespinner-slot-arrow  iconfont icon-up" v-repeat-click="handleClick('seconds')"></span>
      <span class="timespinner-slot-arrow bottom iconfont icon-down" v-repeat-click="handleClick('seconds', '+')"></span>
      <input class="timespinner-editor" lazy number v-model="seconds" />
    </span>
  </span>
</template>

<script type="text/ecmascript-6">
  import { once, on } from 'wind-dom';
  require('../css/time-spinner.css');

  const getValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    value = Number(value);
    if (!isNaN(value)) {
      return value;
    }
  };

  const TYPE_RANGE_MAP = {
    hours: [0, 23],
    minutes: [0, 59],
    seconds: [0, 59]
  };

  const adjust = function(type, operator, value) {
    const range = TYPE_RANGE_MAP[type];
    if (!range) throw new Error('UNKNOWN_TYPE');

    operator = operator || '-';

    if (operator === '+') {
      if (value === range[1]) {
        value = range[0];
      } else {
        value++;
      }
    } else {
      if (value === range[0]) {
        value = range[1];
      } else {
        value--;
      }
    }

    return value;
  };

  export default {
    props: {
      hours: {
        type: Number,
        default: 0
      },

      minutes: {
        type: Number,
        default: 0
      },

      seconds: {
        type: Number,
        default: 0
      },

      showSeconds: {
        type: Boolean,
        default: true
      }
    },

    directives: {
      repeatClick: {
        bind() {
          const el = this.el;
          let interval = null;
          let startTime;

          const handler = () => {
            this.vm.$get(this.expression);
          };

          const clear = function() {
            if (new Date() - startTime < 100) {
              handler();
            }
            clearInterval(interval);
            interval = null;
          };

          on(el, 'mousedown', function() {
            startTime = new Date();
            once(document, 'mouseup', clear);
            interval = setInterval(function() {
              handler();
            }, 100);
          });
        }
      }
    },

    watch: {
      hours(newVal, oldVal) {
        if (!(newVal >= 0 && newVal <= 23)) {
          this.hours = oldVal;
        }
      },

      minutes(newVal, oldVal) {
        if (!(newVal >= 0 && newVal <= 59)) {
          this.minutes = oldVal;
        }
      },

      seconds(newVal, oldVal) {
        if (!(newVal >= 0 && newVal <= 59)) {
          this.seconds = oldVal;
        }
      }
    },

    methods: {
      handleClick(type, operator) {
        if (TYPE_RANGE_MAP.hasOwnProperty(type)) {
          this[type] = adjust(type, operator, this[type]);
        }
      }
    }
  };
</script>