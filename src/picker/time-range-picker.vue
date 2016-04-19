<template>
  <div class="dt-picker">
    <div style="overflow: hidden;">
      <div class="dt-picker-content timerangepicker-content">
        <div class="timerangepicker-content-header">开始时间</div>
        <time-spinner v-ref:min-spinner :show-seconds="showSeconds" @change="handleChange"
          :hours.sync="minHours" :minutes.sync="minMinutes" :seconds.sync="minSeconds">
        </time-spinner>
      </div>
      <div class="dt-picker-content timerangepicker-content">
        <div class="timerangepicker-content-header">结束时间</div>
        <time-spinner v-ref:max-spinner :show-seconds="showSeconds" @change="handleChange"
          :hours.sync="maxHours" :minutes.sync="maxMinutes" :seconds.sync="maxSeconds">
        </time-spinner>
      </div>
    </div>
    <div class="dt-picker-footer">
      <button class="dt-picker-btn" @click="handleConfirm" :disabled="btnDisabled">确定</button>
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
    padding: 10px 15px;
  }

  .timerangepicker-content-header {
    margin-bottom: 5px;
  }

  .timerangepicker-content:first-of-type {
    border-right: 1px solid var(--datepicker-inner-border-color);
  }
</style>

<script type="text/ecmascript-6">

  const isDisabled = function(minTime, maxTime) {
    const minValue = minTime.getHours() * 3600 + minTime.getMinutes() * 60 + minTime.getSeconds();
    const maxValue = maxTime.getHours() * 3600 + maxTime.getMinutes() * 60 + maxTime.getSeconds();

    return minValue > maxValue;
  };

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
          const date = new Date();
          date.setHours(date.getHours() + 1);
          return date;
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

    data() {
      return {
        btnDisabled: isDisabled(this.minTime, this.maxTime)
      }
    },

    methods: {
      handleChange() {
        this.btnDisabled = isDisabled(this.minTime, this.maxTime);
      },


      handleConfirm() {
        this.$emit('pick', [this.minTime, this.maxTime]);
      },

      focusEditor(...args) {
        return this.$refs.minSpinner.focusEditor(...args);
      }
    }
  };
</script>
