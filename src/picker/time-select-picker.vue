<template>
  <div class="dt-picker time-select">
    <div class="dt-picker-content">
      <div class="time-select-item"
        v-for="item in items"
        :class="{ selected: value === item }"
        @click="handleClick(item)">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style>
  .time-select {
    min-width: 200px;
  }
  
  .time-select .dt-picker-content {
    max-height: 200px;
    overflow: auto;
    margin: 0;
  }

  .time-select-item {
    padding: 5px;
  }

  .time-select-item.selected {
    background-color: #e6f1fe;
    color: #2e90fe;
  }

  .time-select-item:hover {
    background-color: #f0f0f0;
  }
</style>

<script type="text/ecmascript-6">
  const parseTime = function(time) {
    const values = ('' || time).split(':');
    if (values.length >= 2) {
      const hours = parseInt(values[0], 10);
      const minutes = parseInt(values[1], 10);

      return {
        hours,
        minutes
      };
    }
    return null;
  };

  const compareTime = function(time1, time2) {
    const value1 = parseTime(time1);
    const value2 = parseTime(time2);

    const minutes1 = value1.minutes + value1.hours * 60;
    const minutes2 = value2.minutes + value2.hours * 60;

    if (minutes1 === minutes2) {
      return 0;
    }

    return minutes1 > minutes2 ? 1 : -1;
  };

  const formatTime = function(time) {
    return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
  };

  const nextTime = function(time, step) {
    const timeValue = parseTime(time);
    const stepValue = parseTime(step);

    const next = {
      hours: timeValue.hours,
      minutes: timeValue.minutes
    };

    next.minutes += stepValue.minutes;
    next.hours += stepValue.hours;

    next.hours += Math.floor(next.minutes / 60);
    next.minutes = next.minutes % 60;

    return formatTime(next);
  };

  export default {
    props: {
      start: {
        default: '09:00'
      },
      end: {
        default: '18:10'
      },
      step: {
        default: '00:30'
      },
      value: {}
    },

    methods: {
      handleClick(item) {
        this.$emit('pick', item);
      }
    },

    computed: {
      items() {
        const start = this.start;
        const end = this.end;
        const step = this.step;

        const result = [];

        if (start && end && step) {
          let current = start;
          while (compareTime(current, end) === -1) {
            result.push(current);
            current = nextTime(current, step);
          }
        }

        return result;
      }
    }
  };
</script>
