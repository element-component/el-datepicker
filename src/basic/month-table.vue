<template>
  <table @click="handleMonthTableClick" class="monthtable">
    <tbody>
    <tr>
      <td :class="{ current: month === 0 }">{{ $t('datepicker.months.jan') }}</td>
      <td :class="{ current: month === 1 }">{{ $t('datepicker.months.feb') }}</td>
      <td :class="{ current: month === 2 }">{{ $t('datepicker.months.mar') }}</td>
    </tr>
    <tr>
      <td :class="{ current: month === 3 }">{{ $t('datepicker.months.apr') }}</td>
      <td :class="{ current: month === 4 }">{{ $t('datepicker.months.may') }}</td>
      <td :class="{ current: month === 5 }">{{ $t('datepicker.months.jun') }}</td>
    </tr>
    <tr>
      <td :class="{ current: month === 6 }">{{ $t('datepicker.months.jul') }}</td>
      <td :class="{ current: month === 7 }">{{ $t('datepicker.months.aug') }}</td>
      <td :class="{ current: month === 8 }">{{ $t('datepicker.months.sep') }}</td>
    </tr>
    <tr>
      <td :class="{ current: month === 9 }">{{ $t('datepicker.months.oct') }}</td>
      <td :class="{ current: month === 10 }">{{ $t('datepicker.months.nov') }}</td>
      <td :class="{ current: month === 11 }">{{ $t('datepicker.months.dec') }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script type="text/ecmascript-6">
  import { $t } from '../util';

  export default {
    props: {
      month: {
        type: Number
      }
    },

    methods: {
      $t: $t,

      handleMonthTableClick(event) {
        const target = event.target;
        if (target.tagName !== 'TD') return;
        const column = target.cellIndex;
        const row = target.parentNode.rowIndex;
        const month = this.month = row * 3 + column;

        this.$emit('pick', month);
      }
    }
  };
</script>
