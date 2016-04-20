<template>
  <div class="dt-picker datepicker">
    <div class="dt-picker-body-wrapper">
      <slot name="sidebar" class="dt-picker-sidebar"></slot>
      <div class="dt-picker-body">
        <div class="dt-picker-header" v-show="currentView !== 'time'">
          <button @click="prevYear" class="dt-picker-iconbtn datepicker-prevbtn iconfont icon-doubleleft"></button>
          <button @click="prevMonth" v-show="currentView === 'date'" class="dt-picker-iconbtn datepicker-prevbtn iconfont icon-left"></button>
          <span @click="showYearPicker" class="datepicker-header-label" :class="{ active: currentView === 'year' }">{{ year }}年</span>
          <span @click="showMonthPicker" v-show="currentView !== 'year'" class="datepicker-header-label" :class="{ active: currentView === 'month' }">{{ month + 1 }}月</span>
          <button @click="nextYear" class="dt-picker-iconbtn datepicker-nextbtn iconfont icon-doubleright"></button>
          <button @click="nextMonth" v-show="currentView === 'date'" class="dt-picker-iconbtn datepicker-nextbtn iconfont icon-right"></button>
        </div>

        <div class="dt-picker-content">
          <date-table v-show="currentView === 'date'" @pick="handleDatePick" :class="{ weekmode: selectionMode === 'week' }"
            :year.sync="year" :month.sync="month" :date.sync="date" :value.sync="value" :selection-mode="selectionMode" :disabled-date="disabledDate">
          </date-table>
          <year-table :year.sync="year" v-show="currentView === 'year'" @pick="handleYearPick"></year-table>
          <month-table :month.sync="month" v-show="currentView === 'month'" @pick="handleMonthPick" ></month-table>

          <div class="datepicker-timewrap" style="text-align: center;" v-if="showTime" v-show="currentView === 'date'">
            <time-spinner :hours.sync="hours" :minutes.sync="minutes" :seconds.sync="seconds"></time-spinner>
          </div>
        </div>
      </div>
    </div>

    <div class="dt-picker-footer" v-show="currentView === 'date'">
      <button class="dt-picker-btn" @click="changeToToday">{{ $t('datepicker.today') }}</button>
      <button class="dt-picker-btn" @click="confirm">{{ $t('datepicker.confirm') }}</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getDayCountOfMonth, getFirstDayOfMonth, getWeekNumber, $t, prevMonth, nextMonth } from '../util';
  require('../css/date-picker.css');

  export default {
    props: {
      currentView: {
        default: 'date'
      },

      date: {
        default() {
          return new Date();
        }
      },

      disabledDate: {},

      value: {},

      showTime: {
        type: Boolean
      },

      selectionMode: {
        type: String,
        default: 'day'
      }
    },

    watch: {
      selectionMode(newVal) {
        if (newVal === 'month') {
          if (this.currentView !== 'year' || this.currentView !== 'month') {
            this.currentView = 'year';
          }
        }
      },

      date(newVal) {
        if (!this.year) {
          this.year = newVal.getFullYear();
          this.month = newVal.getMonth();
        }
      },

      currentView(val) {
        if (val === 'time') {
          this.$refs.timePicker.hours = this.hours;
          this.$refs.timePicker.minutes = this.minutes;
        }
      }
    },

    ready() {
      if (this.date && !this.year) {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
      }
    },

    methods: {
      $t: $t,

      resetDate() {
        this.date = new Date(this.date);
      },

      showMonthPicker() {
        this.currentView = 'month';
      },

      showYearPicker() {
        this.currentView = 'year';
      },

      handleLabelClick() {
        if (this.currentView === 'date') {
          this.showMonthPicker();
        } else if (this.currentView === 'month') {
          this.showYearPicker();
        }
      },

      prevMonth() {
        this.month--;
        if (this.month < 0) {
          this.month = 11;
          this.year--;
        }
      },

      nextMonth() {
        this.month++;
        if (this.month > 11) {
          this.month = 0;
          this.year++;
        }
      },

      nextYear() {
        this.year++;
      },

      prevYear() {
        this.year--;
      },

      handleTimePick(picker) {
        this.hours = picker.hours;
        this.minutes = picker.minutes;

        this.currentView = 'date';
        this.resetDate();
      },

      handleMonthPick(month) {
        const selectionMode = this.selectionMode;
        if (selectionMode !== 'month') {
          this.date.setMonth(month);
          this.currentView = 'date';
          this.resetDate();
        } else {
          this.date.setMonth(month);
          this.resetDate();
          this.value = new Date(this.date.getFullYear(), month, 1);
          this.$emit('pick', this.value);
        }
      },

      handleDatePick(value) {
        if (this.selectionMode === 'day') {
          this.$emit('pick', new Date(value.getTime()));
          this.date = value;
        } else if (this.selectionMode === 'week') {
          this.$emit('pick', value.value);
        }

        this.resetDate();
      },

      handleYearPick(year) {
        this.date.setFullYear(year);
        if (this.selectionMode === 'year') {
          this.$emit('pick', year);
        } else {
          this.currentView = 'month';
        }

        this.resetDate();
      },

      changeToToday() {
        this.date.setTime(+new Date());
        this.resetDate();
      },

      confirm() {
        this.$emit('pick', this.date);
      },

      clear() {
        this.$emit('pick', { date: null });
      }
    },

    components: {
      TimeSpinner: require('../basic/time-spinner.vue'),
      YearTable: require('../basic/year-table.vue'),
      MonthTable: require('../basic/month-table.vue'),
      DateTable: require('../basic/date-table.vue')
    },

    compiled() {
      if (this.selectionMode === 'month') {
        this.currentView = 'month';
      }
    },

    data() {
      return {
        year: null,
        month: null
      }
    },

    computed: {
      resetView() {
        if (this.selectionMode !== 'month' && this.selectionMode !== 'year') {
          this.currentView = 'date';
        } else {
          this.currentView = 'year';
        }
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
      },

      hours: {
        get() {
          return this.date.getHours();
        },
        set(hours) {
          this.date.setHours(hours);
        }
      },

      minutes: {
        get() {
          return this.date.getMinutes();
        },
        set(minutes) {
          this.date.setMinutes(minutes);
        }
      },

      seconds: {
        get() {
          return this.date.getSeconds();
        },
        set(seconds) {
          this.date.setSeconds(seconds);
        }
      },

      timeText() {
        const hours = this.hours;
        const minutes = this.minutes;
        return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
      },

      label() {
        const year = this.year;
        const month = this.month + 1;

        if (this.currentView === 'date') {
          return year + ' / ' + month;
        }

        return year;
      }
    }
  };
</script>
