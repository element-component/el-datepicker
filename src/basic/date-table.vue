<template>
  <table @click="handleClick" @mousemove="handleMouseMove" cellspacing="0" cellpadding="0" class="datetable">
    <tbody>
    <tr>
      <th v-if="showWeekNumber">{{ $t('datepicker.week') }}</th>
      <th>{{ $t('datepicker.weeks.sun') }}</th>
      <th>{{ $t('datepicker.weeks.mon') }}</th>
      <th>{{ $t('datepicker.weeks.tue') }}</th>
      <th>{{ $t('datepicker.weeks.wed') }}</th>
      <th>{{ $t('datepicker.weeks.thu') }}</th>
      <th>{{ $t('datepicker.weeks.fri') }}</th>
      <th>{{ $t('datepicker.weeks.sat') }}</th>
    </tr>
    <tr v-for="row in rows" class="datetable-row" :class="{ current: value && isWeekActive(row[1]) }">
      <td v-for="cell in row" class="{{ getCellClasses(cell) }}">{{ cell.type === 'today' ? '今天' : cell.text }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script type="text/ecmascript-6">
  import { $t, getFirstDayOfMonth, getDayCountOfMonth, getWeekNumber, getStartDateOfMonth, DAY_DURATION } from '../util';
  import { hasClass } from 'wind-dom';
  import Vue from 'vue';

  const clearHours = function(time) {
    const cloneDate = new Date(time);
    cloneDate.setHours(0, 0, 0, 0);
    return cloneDate.getTime();
  };

  export default {
    props: {
      date: {},

      year: {},

      month: {},

      selectionMode: {
        default: 'day'
      },

      showWeekNumber: {
        type: Boolean,
        default: false
      },

      disabledDate: {},

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

      value: {}
    },

    computed: {
      monthDate() {
        return this.date.getDate();
      },

      startDate() {
        return getStartDateOfMonth(this.year, this.month);
      },

      rows() {
        const date = new Date(this.year, this.month, 1);
        let day = getFirstDayOfMonth(date); // day of first day
        const dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
        const dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));

        day = (day === 0 ? 7 : day);

        const rows = this.tableRows;
        let count = 1;
        let firstDayPosition;

        const startDate = this.startDate;
        const disabledDate = this.disabledDate;
        const now = clearHours(new Date());

        for (var i = 0; i < 6; i++) {
          const row = rows[i];

          if (this.showWeekNumber) {
            if (!row[0]) {
              row[0] = { type: 'week', text: getWeekNumber(new Date(startDate.getTime() + DAY_DURATION * (i * 7 + 1))) };
            }
          }

          for (var j = 0; j < 7; j++) {
            let cell = row[this.showWeekNumber ? j + 1 : j];
            if (!cell) {
              cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false };
            }

            cell.type = 'normal';

            const index = i * 7 + j;
            const time = startDate.getTime() + DAY_DURATION * index;
            cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);
            cell.start = this.minDate && time === clearHours(this.minDate);
            cell.end = this.maxDate && time === clearHours(this.maxDate);
            const isToday = time === now;

            if (i === 0) {
              if (j >= day) {
                cell.text = count++;
                if (count === 2) {
                  firstDayPosition = i * 7 + j;
                }
              } else {
                cell.text = dateCountOfLastMonth - (day - j % 7) + 1;
                cell.type = 'prevmonth';
              }
            } else {
              if (count <= dateCountOfMonth) {
                cell.text = count++;
                if (count === 2) {
                  firstDayPosition = i * 7 + j;
                }
              } else {
                cell.text = count++ - dateCountOfMonth;
                cell.type = 'nextmonth';
              }
            }

            if (isToday) {
              cell.type = 'today';
            }

            cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));

            Vue.set(row, this.showWeekNumber ? j + 1 : j, cell);
          }

          if (this.selectionMode === 'week') {
            const start = this.showWeekNumber ? 1 : 0;
            const end = this.showWeekNumber ? 7 : 6;
            const isWeekActive = this.isWeekActive(row[start + 1]);

            row[start].inRange = isWeekActive;
            row[start].start = isWeekActive;
            row[end].inRange = isWeekActive;
            row[end].end = isWeekActive;
          }
        }

        rows.firstDayPosition = firstDayPosition;

        return rows;
      }
    },

    watch: {
      'rangeState.endDate'(newVal) {
        this.markRange(newVal);
      },

      minDate(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.rangeState.selecting = true;
          this.markRange(newVal);
        } else if (!newVal) {
          this.rangeState.selecting = false;
          this.markRange(newVal);
        } else {
          this.markRange();
        }
      },

      maxDate(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.rangeState.selecting = false;
          this.markRange(newVal);
          this.$emit('pick');
        }
      }
    },

    data() {
      return {
        tableRows: [ [], [], [], [], [], [] ]
      };
    },

    methods: {
      $t: $t,

      getCellClasses(cell) {
        const selectionMode = this.selectionMode;
        const monthDate = this.monthDate;

        let classes = [];
        if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
          classes.push('available');
          if (cell.type === 'today') {
            classes.push('today');
          }
        } else {
          classes.push(cell.type);
        }

        if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') &&
          this.year === this.date.getFullYear() && this.month === this.date.getMonth() && monthDate === Number(cell.text)) {
          classes.push('current');
        }

        if (cell.inRange && ((cell.type === 'normal' || cell.type === 'today') || this.selectionMode === 'week')) {
          classes.push('inrange');

          if (cell.start) {
            classes.push('startdate');
          }

          if (cell.end) {
            classes.push('enddate');
          }
        }

        if (cell.disabled) {
          classes.push('disabled');
        }

        return classes.join(' ');
      },

      getDateOfCell(row, column) {
        const startDate = this.startDate;

        return new Date(startDate.getTime() + (row * 7 + (column - (this.showWeekNumber ? 1 : 0))) * DAY_DURATION);
      },

      getCellByDate(date) {
        const startDate = this.startDate;
        const rows = this.rows;
        const index = (date - startDate) / DAY_DURATION;
        const row = rows[Math.floor(index / 7)];

        if (this.showWeekNumber) {
          return row[index % 7 + 1];
        } else {
          return row[index % 7];
        }
      },

      isWeekActive(cell) {
        if (this.selectionMode !== 'week') return false;
        const newDate = new Date(this.year, this.month, 1);
        const year = newDate.getFullYear();
        const month = newDate.getMonth();

        if (cell.type === 'prevmonth') {
          newDate.setMonth(month === 0 ? 11 : month - 1);
          newDate.setFullYear(month === 0 ? year - 1 : year);
        }

        if (cell.type === 'nextmonth') {
          newDate.setMonth(month === 11 ? 0 : month + 1);
          newDate.setFullYear(month === 11 ? year + 1 : year);
        }

        newDate.setDate(parseInt(cell.text, 10));

        return year + 'w' + getWeekNumber(newDate) === this.value;
      },

      markRange(maxDate) {
        const startDate = this.startDate;
        if (!maxDate) {
          maxDate = this.maxDate;
        }

        const rows = this.rows;
        const minDate = this.minDate;
        for (var i = 0, k = rows.length; i < k; i++) {
          const row = rows[i];
          for (var j = 0, l = row.length; j < l; j++) {
            if (this.showWeekNumber && j === 0) continue;

            const cell = row[j];
            const index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
            const time = startDate.getTime() + DAY_DURATION * index;

            cell.inRange = minDate && time >= clearHours(minDate) && time <= clearHours(maxDate);
            cell.start = minDate && time === clearHours(minDate.getTime());
            cell.end = maxDate && time === clearHours(maxDate.getTime());
          }
        }
      },

      handleMouseMove(event) {
        if (!this.rangeState.selecting) return;

        const target = event.target;
        if (target.tagName !== 'TD') return;

        const column = target.cellIndex;
        const row = target.parentNode.rowIndex - 1;
        const { row: oldRow, column: oldColumn } = this.rangeState;

        if (oldRow !== row || oldColumn !== column) {
          this.rangeState.row = row;
          this.rangeState.column = column;

          this.rangeState.endDate = this.getDateOfCell(row, column);
        }
      },

      handleClick(event) {
        let target = event.target;
        if (target.tagName !== 'TD') return;
        if (hasClass(target, 'disabled') || hasClass(target, 'week')) return;

        var selectionMode = this.selectionMode;

        if (selectionMode === 'week') {
          target = target.parentNode.cells[1];
        }

        let year = this.year;
        let month = this.month;

        const cellIndex = target.cellIndex;
        const rowIndex = target.parentNode.rowIndex;

        const cell = this.rows[rowIndex - 1][cellIndex];
        const text = cell.text;
        const className = target.className;

        const newDate = new Date(this.year, this.month, 1);

        const clickNormalCell = className.indexOf('prev') === -1 && className.indexOf('next') === -1;

        if (className.indexOf('prev') !== -1) {
          if (month === 0) {
            year = year - 1;
            month = 11;
          } else {
            month = month - 1;
          }
          newDate.setFullYear(year);
          newDate.setMonth(month);
        } else if (className.indexOf('next') !== -1) {
          if (month === 11) {
            year = year + 1;
            month = 0;
          } else {
            month = month + 1;
          }
          newDate.setFullYear(year);
          newDate.setMonth(month);
        }

        newDate.setDate(parseInt(text, 10));

        if (clickNormalCell && this.selectionMode === 'range') {
          if (this.minDate && this.maxDate) {
            this.minDate = new Date(newDate.getTime());
            this.maxDate = null;
            this.rangeState.selecting = true;
            this.markRange(this.minDate);
          } else if (this.minDate && !this.maxDate) {
            if (newDate >= this.minDate) {
              this.maxDate = new Date(newDate.getTime());
              this.rangeState.selecting = false;

              this.$emit('pick');
            } else {
              this.minDate = new Date(newDate.getTime());
            }
          } else if (!this.minDate) {
            this.minDate = new Date(newDate.getTime());
            this.rangeState.selecting = true;
            this.markRange(this.minDate);
          } else if (!this.minDate && this.maxDate) {
            // TODO 现在走不到这里
            if (newDate <= this.maxDate) {
              this.minDate = new Date(newDate.getTime());
              this.rangeState.selecting = false;

              this.$emit('pick');
            }
          }
        }

        if (selectionMode === 'day') {
          this.$emit('pick', newDate);
        } else if (selectionMode === 'week') {
          var weekNumber = getWeekNumber(newDate);
          this.value = newDate.getFullYear() + 'w' + weekNumber;
          this.$emit('pick', { year: newDate.getFullYear(), week: weekNumber, value: this.value });
        }
      }
    }
  };
</script>
