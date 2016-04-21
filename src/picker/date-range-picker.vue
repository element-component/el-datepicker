<template>
  <div class="dt-picker daterangepicker">
    <div class="dt-picker-body-wrapper">
      <slot name="sidebar" class="dt-picker-sidebar"></slot>
      <div class="dt-picker-sidebar" v-if="shortcuts">
        <button class="dt-picker-shortcut" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{shortcut.text}}</button>
      </div>
      <div class="dt-picker-body">
        <div class="daterangepicker-timeheader" v-if="showTime">
          <span class="daterangepicker-editorswrap">
            <input v-model="leftVisibleDate" placeholder="开始日期" class="d-texteditor-editor date" readonly/>
            <span class="daterangepicker-timepickerwrap">
              <input v-model="leftVisibleTime" @focus="minDate && (leftTimePickerVisible = true)" placeholder="开始时间" class="d-texteditor-editor time" :readonly="!minDate"/>
              <time-picker :date.sync="minDate" @pick="handleLeftTimePick" v-show="leftTimePickerVisible"></time-picker>
            </span>
          </span>
          <span class="iconfont icon-rightarrow"></span>
          <span class="daterangepicker-editorswrap right">
            <input v-model="rightVisibleDate" placeholder="结束日期" class="d-texteditor-editor date" readonly/>
            <span class="daterangepicker-timepickerwrap">
              <input v-model="rightVisibleTime" @focus="maxDate && (rightTimePickerVisible = true)" placeholder="结束时间" class="d-texteditor-editor time" :readonly="!maxDate"/>
              <time-picker :date.sync="maxDate" @pick="handleRightTimePick" v-show="rightTimePickerVisible"></time-picker>
            </span>
          </span>
        </div>
        <div class="dt-picker-content daterangepicker-content daterangepicker-content__left">
          <div class="daterangepicker-header">
            <button @click="prevYear" class="dt-picker-iconbtn iconfont icon-doubleleft"></button>
            <button @click="prevMonth" class="dt-picker-iconbtn iconfont icon-left"></button>
            <div>{{ leftLabel }}</div>
          </div>
          <date-table selection-mode="range" :date.sync="date" :year.sync="leftYear" :month.sync="leftMonth"
            :min-date.sync="minDate" :max-date.sync="maxDate" :range-state.sync="rangeState" @pick="handleRangePick"></date-table>
        </div>
        <div class="dt-picker-content daterangepicker-content">
          <div class="daterangepicker-header">
            <button @click="nextYear" class="dt-picker-iconbtn iconfont icon-doubleright"></button>
            <button @click="nextMonth" class="dt-picker-iconbtn iconfont icon-right"></button>
            <div>{{ rightLabel }}</div>
          </div>
          <date-table selection-mode="range" :date.sync="rightDate" :year.sync="rightYear" :month.sync="rightMonth"
            :min-date.sync="minDate" :max-date.sync="maxDate" :range-state.sync="rangeState" @pick="handleRangePick"></date-table>
        </div>
      </div>
    </div>
    <div class="dt-picker-footer" v-if="showTime">
      <a href="JavaScript:" class="dt-picker-btn-link" @click="changeToToday">{{ $t('datepicker.today') }}</a>
      <button class="dt-picker-btn" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { nextMonth, prevMonth, $t, formatDate } from '../util';
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
      shortcuts: {},
      value: {}
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

      leftVisibleDate() {
        return formatDate(this.minDate);
      },

      rightVisibleDate() {
        return formatDate(this.maxDate);
      },

      leftVisibleTime() {
        return formatDate(this.minDate, 'HH:mm:ss');
      },

      rightVisibleTime() {
        return formatDate(this.maxDate, 'HH:mm:ss');
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

    data() {
      return {
        leftTimePickerVisible: false,
        rightTimePickerVisible: false
      };
    },

    watch: {
      value(newVal) {
        if (!newVal) {
          this.minDate = null;
          this.maxDate = null;
        } else if (Array.isArray(newVal)) {
          this.minDate = newVal[0];
          this.maxDate = newVal[1];
        }
      }
    },

    methods: {
      $t,

      handleRangePick() {
        if (!this.showTime) {
          this.$emit('pick', [this.minDate, this.maxDate]);
        }
      },

      changeToToday() {
        this.date = new Date();
      },

      handleShortcutClick(shortcut) {
        if (shortcut.onClick) {
          shortcut.onClick(this);
        }
      },

      resetView() {
        this.leftTimePickerVisible = false;
        this.rightTimePickerVisible = false;
      },

      handleLeftTimePick(value) {
        if (this.minDate) {
          this.minDate.setHours(value.getHours());
          this.minDate.setMinutes(value.getMinutes());
          this.minDate.setSeconds(value.getSeconds());

          this.minDate = new Date(this.minDate);
        }
        this.leftTimePickerVisible = false;
      },

      handleRightTimePick(value) {
        if (this.maxDate) {
          this.maxDate.setHours(value.getHours());
          this.maxDate.setMinutes(value.getMinutes());
          this.maxDate.setSeconds(value.getSeconds());

          this.maxDate = new Date(this.maxDate);
        }
        this.rightTimePickerVisible = false;
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
      TimePicker: require('../picker/time-picker.vue'),
      DateTable: require('../basic/date-table.vue')
    }
  };
</script>
