<template>
  <div class="dt-picker time-select">
    <div class="dt-picker-content">
      <div
        class="time-select-item"
        v-for="item in items"
        :class="{ active: value === item }"
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

  .time-select-item.active {
    color: red;
  }

  .time-select-item:hover {
    background-color: #f0f0f0;
  }
</style>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {}
    },

    methods: {
      handleClick(item) {
        this.$emit('pick', item);
      }
    },

    data() {
      return {
        items: [
          '07:30',
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00'
        ]
      }
    }
  };
</script>
