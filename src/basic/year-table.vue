<template>
  <table @click="handleYearTableClick" class="yeartable">
    <tbody>
    <tr>
      <td @click="prevTenYear" class="iconfont icon-left"></td>
      <td :class="{ current: year === startYear }">{{ startYear }}</td>
      <td :class="{ current: year === startYear + 1 }">{{ startYear + 1 }}</td>
    </tr>
    <tr>
      <td :class="{ current: year === startYear + 2 }">{{ startYear + 2 }}</td>
      <td :class="{ current: year === startYear + 3 }">{{ startYear + 3 }}</td>
      <td :class="{ current: year === startYear + 4 }">{{ startYear + 4 }}</td>
    </tr>
    <tr>
      <td :class="{ current: year === startYear + 5 }">{{ startYear + 5 }}</td>
      <td :class="{ current: year === startYear + 6 }">{{ startYear + 6 }}</td>
      <td :class="{ current: year === startYear + 7 }">{{ startYear + 7 }}</td>
    </tr>
    <tr>
      <td :class="{ current: year === startYear + 8 }">{{ startYear + 8 }}</td>
      <td :class="{ current: year === startYear + 9 }">{{ startYear + 9 }}</td>
      <td @click="nextTenYear" class="iconfont icon-right"></td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>

<script type="text/ecmascript-6">
  export default {
    props: {
      year: {
        type: Number
      }
    },

    computed: {
      startYear() {
        return Math.floor(this.year / 10) * 10;
      }
    },

    methods: {
      nextTenYear() {
        this.year += 10;
      },

      prevTenYear() {
        this.year -= 10;
      },

      handleYearTableClick(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
          const column = target.cellIndex;
          const row = target.parentNode.rowIndex;
          const index = row * 3 + column;

          if (index === 0 || index === 11) return;

          const year = this.year = parseInt(target.textContent || target.innerText, 10);
          this.$emit('pick', year);
        }
      }
    }
  };
</script>
