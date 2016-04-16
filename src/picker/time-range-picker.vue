<template>
  <div class="dt-picker">
    <div style="overflow: hidden;">
      <div class="dt-picker-content timerangepicker-content">
        <time-spinner v-ref:min-spinner :hours.sync="minHours" :minutes.sync="minMinutes" :seconds.sync="minSeconds" :show-seconds="showSeconds"></time-spinner>
      </div>
      <div class="dt-picker-content timerangepicker-content">
        <time-spinner v-ref:max-spinner :hours.sync="maxHours" :minutes.sync="maxMinutes" :seconds.sync="maxSeconds" :show-seconds="showSeconds"></time-spinner>
      </div>
    </div>
    <div class="dt-picker-footer">
      <button class="dt-picker-btn" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<style scoped>
  @import '../css/vars.css';

  .dt-picker {
    width: 360px;
  }

  .dt-picker-content {
    padding: 20px 0;
    text-align: center;
  }

  .timerangepicker-content {
    float: left;
    width: 50%;
    box-sizing: border-box;
    margin: 0;
    padding: 20px;
  }

  .timerangepicker-content:first-of-type {
    border-right: 1px solid var(--datepicker-inner-border-color);
  }
</style>

<script type="text/ecmascript-6">
  export default {
    components: {
      TimeSpinner: require('../basic/time-spinner.vue')
    },

    props: {
      minTime: {
        default() {
          return new Date();
        }
      },
      maxTime: {
        default() {
          return new Date();
        }
      },
      format: {
        default: 'HH:mm:ss'
      }
    },

    computed: {
      showSeconds() {
        return (this.format || '').indexOf('ss') !== -1;
      },

      minHours: {
        get() {
          if (this.minTime) {
            return this.minTime.getHours();
          }
          return 0;
        },
        set(hours) {
          if (this.minTime) {
            this.minTime.setHours(hours);
          }
        }
      },

      minMinutes: {
        get() {
          if (this.minTime) {
            return this.minTime.getMinutes();
          }
          return 0;
        },
        set(minutes) {
          if (this.minTime) {
            this.minTime.setMinutes(minutes);
          }
        }
      },

      minSeconds: {
        get() {
          if (this.minTime) {
            return this.minTime.getSeconds();
          }
          return 0;
        },
        set(seconds) {
          if (this.minTime) {
            this.minTime.setSeconds(seconds);
          }
        }
      },

      maxHours: {
        get() {
          if (this.maxTime) {
            return this.maxTime.getHours();
          }
          return 0;
        },
        set(hours) {
          if (this.maxTime) {
            this.maxTime.setHours(hours);
          }
        }
      },

      maxMinutes: {
        get() {
          if (this.maxTime) {
            return this.maxTime.getMinutes();
          }
          return 0;
        },
        set(minutes) {
          if (this.maxTime) {
            this.maxTime.setMinutes(minutes);
          }
        }
      },

      maxSeconds: {
        get() {
          if (this.maxTime) {
            return this.maxTime.getSeconds();
          }
          return 0;
        },
        set(seconds) {
          if (this.maxTime) {
            this.maxTime.setSeconds(seconds);
          }
        }
      }
    },

    methods: {
      handleConfirm() {
        this.$emit('pick', [this.minTime, this.maxTime]);
      },

      focusEditor(...args) {
        return this.$refs.minSpinner.focusEditor(...args);
      }
    }
  };
</script>
