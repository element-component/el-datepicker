<template>
  <div class="dt-picker daterangepicker">
    <div class="dt-picker-body-wrapper">
      <slot name="sidebar" class="dt-picker-sidebar"></slot>
      <div class="dt-picker-sidebar" v-if="shortcuts">
        <button class="dt-picker-shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{shortcut.text}}</button>
      </div>
      <div class="dt-picker-body">
        <div class="dt-picker-content daterangepicker-content">
          <div class="daterangepicker-header">
            <button @click="prevYear" class="dt-picker-iconbtn iconfont icon-doubleleft"></button>
            <button @click="prevMonth" class="dt-picker-iconbtn iconfont icon-left"></button>
            <div>{{ leftLabel }}</div>
          </div>
          <date-table selection-mode="range" :date.sync="date" :year.sync="leftYear" :month.sync="leftMonth"
            :min-date.sync="minDate" :max-date.sync="maxDate" :range-state.sync="rangeState"></date-table>
          <div style="text-align: center;" v-if="showTime">
            <time-spinner :hours.sync="leftHours" :minutes.sync="leftMinutes" :seconds.sync="leftSeconds"></time-spinner>
          </div>
        </div>
        <div class="dt-picker-content daterangepicker-content">
          <div class="daterangepicker-header">
            <button @click="nextYear" class="dt-picker-iconbtn iconfont icon-doubleright"></button>
            <button @click="nextMonth" class="dt-picker-iconbtn iconfont icon-right"></button>
            <div>{{ rightLabel }}</div>
          </div>
          <date-table selection-mode="range" :date.sync="rightDate" :year.sync="rightYear" :month.sync="rightMonth"
            :min-date.sync="minDate" :max-date.sync="maxDate" :range-state.sync="rangeState"></date-table>
          <div style="text-align: center;" v-if="showTime">
            <time-spinner :hours.sync="rightHours" :minutes.sync="rightMinutes" :seconds.sync="rightSeconds"></time-spinner>
          </div>
        </div>
      </div>
    </div>
    <div class="dt-picker-footer">
      <a href="JavaScript:" class="dt-picker-btn-link" @click="changeToToday">{{ $t('datepicker.today') }}</a>
      <button class="dt-picker-btn" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { nextMonth, prevMonth, $t } from '../util';
  require('../css/date-range-picker.css');

  export default {
    props: {
      date: {
        default() {
          return new Date();
        }
      },
      minDate: {},
      maxDate: {},
      rangeState: {
        default() {
          return {
            endDate: null,
            selecting: false,
            row: null,
            column: null
          };
        }
      },
      showTime: {
        type: Boolean,
        default: false
      },
      shortcuts: {}
    },

    computed: {
      leftLabel() {
        return this.date.getFullYear() + '年 ' + (this.date.getMonth() + 1) + '月';
      },

      rightLabel() {
        return this.rightDate.getFullYear() + '年 ' + (this.rightDate.getMonth() + 1) + '月';
      },

      leftYear() {
        return this.date.getFullYear();
      },

      leftMonth() {
        return this.date.getMonth();
      },

      rightYear() {
        return this.rightDate.getFullYear();
      },

      rightMonth() {
        return this.rightDate.getMonth();
      },

      leftHours: {
        get() {
          return this.date.getHours();
        },
        set(hours) {
          this.date.setHours(hours);
        }
      },

      leftMinutes: {
        get() {
          return this.date.getMinutes();
        },
        set(minutes) {
          this.date.setMinutes(minutes);
        }
      },

      leftSeconds: {
        get() {
          return this.date.getSeconds();
        },
        set(seconds) {
          this.date.setSeconds(seconds);
        }
      },

      rightHours: {
        get() {
          return this.rightDate.getHours();
        },
        set(hours) {
          this.rightDate.setHours(hours);
        }
      },

      rightMinutes: {
        get() {
          return this.rightDate.getMinutes();
        },
        set(minutes) {
          this.rightDate.setMinutes(minutes);
        }
      },

      rightSeconds: {
        get() {
          return this.rightDate.getSeconds();
        },
        set(seconds) {
          this.rightDate.setSeconds(seconds);
        }
      },

      rightDate() {
        const newDate = new Date(this.date);
        const month = newDate.getMonth();
        newDate.setDate(1);

        if (month === 11) {
          newDate.setFullYear(newDate.getFullYear() + 1);
          newDate.setMonth(0);
        } else {
          newDate.setMonth(month + 1);
        }
        return newDate;
      }
    },

    methods: {
      $t,

      changeToToday() {
        this.date = new Date();
      },

      handleShortcutClick(shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },

      prevMonth() {
        this.date = prevMonth(this.date);
      },

      nextMonth() {
        this.date = nextMonth(this.date);
      },

      nextYear() {
        const date = this.date;
        date.setFullYear(date.getFullYear() + 1);
        this.resetDate();
      },

      prevYear() {
        const date = this.date;
        date.setFullYear(date.getFullYear() - 1);
        this.resetDate();
      },

      handleConfirm() {
        this.$emit('pick', [this.minDate, this.maxDate]);
      },

      resetDate() {
        this.date = new Date(this.date);
      }
    },

    components: {
      TimeSpinner: require('../basic/time-spinner.vue'),
      DateTable: require('../basic/date-table.vue')
    }
  };
</script>
