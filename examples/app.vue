<template>
  <div class="block">
    <date-editor type="time" placeholder="选择时间" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="time" placeholder="选择时间(没有秒)" format="HH:mm" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="fixed-time" placeholder="选择固定时间" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="timerange" placeholder="选择时间范围" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="timerange" placeholder="选择时间范围(没有秒)" format="HH:mm" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="date" placeholder="选择日期" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="datetime" placeholder="选择日期时间" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="month" placeholder="选择月" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="week" placeholder="选择周" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="daterange" placeholder="选择日期范围" style="width: 240px;"></date-editor>
  </div>

  <div class="block">
    <date-editor type="datetimerange" placeholder="选择日期时间范围" style="width: 340px;"></date-editor>
  </div>

  <div class="block">
    <date-picker style="display: inline-block; width: 380px;" :disabled-date="disabledDate">
      <div slot="sidebar">
        <button class="dt-picker-shortcut">最近一周</button>
        <button class="dt-picker-shortcut">最近一个月</button>
        <button class="dt-picker-shortcut">最近三个月</button>
      </div>
    </date-picker>
  </div>

  <div class="block">
    <date-range-picker style="display: inline-block;">
      <div slot="sidebar">
        <button class="dt-picker-shortcut">最近一周</button>
        <button class="dt-picker-shortcut">最近一个月</button>
        <button class="dt-picker-shortcut">最近三个月</button>
      </div>
    </date-range-picker>
  </div>

  <!-- <time-picker :hours="5" :minutes="12"></time-picker> -->

  <!-- <time-dial></time-dial> -->
</template>

<style>
  .block {
    margin-bottom: 20px;
  }
</style>

<script>
  const disabledDate = function(current) {
    return current && current.getTime() > Date.now();
  };

  import components from '../src';

  export default {
    name: 'app',

    data() {
      return {
        disabledDate
      };
    },

    components
  };
</script>
