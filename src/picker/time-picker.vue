<template>
  <div class="dt-picker">
    <div class="dt-picker-content">
      <time-spinner v-ref:spinner :show-seconds="showSeconds"
        :hours.sync="hours" :minutes.sync="minutes" :seconds.sync="seconds">
      </time-spinner>
    </div>
    <div class="dt-picker-footer">
      <button class="dt-picker-btn" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<style scoped>
  .dt-picker {
    width: 200px;
  }

  .dt-picker-content {
    padding: 10px 0;
    text-align: center;
  }
</style>

<script type="text/ecmascript-6">
  export default {
    components: {
      TimeSpinner: require('../basic/time-spinner.vue')
    },

    props: {
      date: {
        default() {
          return new Date();
        }
      },
      format: {
        default: 'HH:mm:ss'
      },
      value: {}
    },

    watch: {
      value(newVal) {
        if (newVal instanceof Date) {
          this.date = newVal;
        } else if (!newVal) {
          this.date = new Date();
        }
      }
    },

    computed: {
      showSeconds() {
        return (this.format || '').indexOf('ss') !== -1;
      },

      hours: {
        get() {
          if (this.date) {
            return this.date.getHours();
          }
          return 0;
        },
        set(hours) {
          if (this.date) {
            this.date.setHours(hours);
          }
        }
      },

      minutes: {
        get() {
          if (this.date) {
            return this.date.getMinutes();
          }
          return 0;
        },
        set(minutes) {
          if (this.date) {
            this.date.setMinutes(minutes);
          }
        }
      },

      seconds: {
        get() {
          if (this.date) {
            return this.date.getSeconds();
          }
          return 0;
        },
        set(seconds) {
          if (this.date) {
            this.date.setSeconds(seconds);
          }
        }
      }
    },

    methods: {
      handleConfirm() {
        const spinner = this.$refs.spinner;
        const date = new Date();

        const { hours, minutes, seconds } = spinner;
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        this.$emit('pick', date);
      },

      focusEditor(...args) {
        return this.$refs.spinner.focusEditor(...args);
      }
    }
  };
</script>
