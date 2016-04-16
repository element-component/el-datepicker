<template>
  <span class="d-texteditor {{size}} {{ haveTrigger ? 'have-trigger' : '' }} {{ pickerVisible ? 'active' : '' }} {{ !!this.value ? 'filled' : '' }}">
    <editor></editor>
    <span class="d-texteditor-clear iconfont icon-cross" @click="handleClear"></span>
    <span @click="toggleDatePicker()" class="d-texteditor-trigger iconfont icon-calendar" v-if="haveTrigger"></span>
  </span>
</template>

<style>
  .d-texteditor .dt-picker {
    position: absolute;
    box-shadow: 0 2px 6px #ccc;
    background: #fff;
    z-index: 10;
  }
</style>

<script type="text/ecmascript-6">
  var Vue = require('vue');
  import { merge, formatDate, parseDate, getWeekNumber } from './util';
  import { default as Dropdown } from './util/dropdown';

  require('./css/text-editor.css');
  require('./iconfont/iconfont.css');

  const DEFAULT_FORMATS = {
    date: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    datetime: 'YYYY-MM-DD HH:mm:ss',
    time: 'HH:mm:ss',
    timerange: 'HH:mm:ss',
    daterange: 'YYYY-MM-DD',
    datetimerange: 'YYYY-MM-DD HH:mm:ss'
  };

  const HAVE_TRIGGER_TYPES = ['date', 'datetime', 'time', 'week', 'month', 'daterange', 'timerange', 'datetimerange'];
  const RANGE_SEPARATOR = '  ~  ';
  const DATE_FORMATTER = function(value, format) {
    return formatDate(value, format);
  };

  const DATE_PARSER = function(text, format) {
    return parseDate(text, format);
  };

  const RANGE_FORMATTER = function(value, format) {
    if (Array.isArray(value) && value.length === 2) {
      const [ start, end ] = value;
      if (start && end) {
        return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
      }
    }
    return '';
  };

  const RANGE_PARSER = function(text, format) {
    const array = text.split(RANGE_SEPARATOR);
    if (array.length === 2) {
      return [parseDate(array[0], format), parseDate(array[1], format)];
    }
    return [];
  };

  const TYPE_VALUE_RESOLVER_MAP = {
    default: {
      formatter(value) {
        if (!value) return '';
        return '' + value;
      },
      parser(text) {
        if (text === undefined || text === '') return null;
        return text;
      }
    },
    week: {
      formatter(value) {
        if (value instanceof Date) {
          const weekNumber = getWeekNumber(value);
          return value.getFullYear() + 'w' + (weekNumber > 9 ? weekNumber : '0' + weekNumber);
        }
        return value;
      },
      parser(text) {
        const array = (text || '').split('w');
        if (array.length === 2) {
          const year = Number(array[0]);
          const month = Number(array[1]);

          if (!isNaN(year) && !isNaN(month) && month < 54) {
            return text;
          }
        }
        return null;
      }
    },
    date: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    datetime: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    daterange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    datetimerange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    timerange: {
      formatter: RANGE_FORMATTER,
      parser: RANGE_PARSER
    },
    time: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    month: {
      formatter: DATE_FORMATTER,
      parser: DATE_PARSER
    },
    number: {
      formatter(value) {
        return value;
      },
      parser(text) {
        let result = Number(text);

        if (!isNaN(text)) {
          return result;
        } else {
          return null;
        }
      }
    }
  };

  const FUNCTION_KEYS = [13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40];

  export default {
    props: {
      type: {
        type: String,
        default: 'text'
      },

      format: {
        type: String
      },

      size: {
        type: String,
        default: ''
      },

      readonly: {
        type: Boolean,
        default: false
      },

      placeholder: {
        type: String
      },

      value: {},

      lazy: {
        type: Boolean,
        default: false
      }
    },

    watch: {
      pickerVisible(newVal) {
        if (newVal === true) {
          Dropdown.open(this);
        } else {
          Dropdown.close(this);
        }
      }
    },

    computed: {
      editable() {
        return this.type.indexOf('range') !== -1;
      },

      selectionMode() {
        if (this.type === 'week') {
          return 'week';
        } else if (this.type === 'month') {
          return 'month';
        }

        return 'day';
      },

      haveTrigger() {
        return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
      },

      visualValue: {
        get() {
          const value = this.value;
          const formatter = (TYPE_VALUE_RESOLVER_MAP[this.type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
          const format = DEFAULT_FORMATS[this.type];

          return formatter(value, this.format || format);
        },

        set(value) {
          if (value) {
            const type = this.type;
            const parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
            const parsedValue = parser(value, this.format || DEFAULT_FORMATS[type]);

            if (parsedValue) {
              this.value = parsedValue;
            }
            return;
          }
          this.value = value;
        }
      },

      editorType() {
        return 'text';
      }
    },

    data() {
      return {
        pickerVisible: false
      };
    },

    components: {
      editor: {
        inherit: true,
        template: '',
        created() {
          var parent = this.$parent;
          var type = parent.type;
          var lazy = parent.lazy;
          if (type === 'number' && HAVE_TRIGGER_TYPES.indexOf(type) !== -1) {
            this.$options.template = `<input class="d-texteditor-editor" @focus="$parent.handleFocus" @blur="$parent.handleBlur" @keydown="$parent.handleKeydown($event)" lazy @change="$parent.handleChange($event)" type="${parent.editorType}" v-model="$parent.visualValue" placeholder="{{$parent.placeholder}}" readonly="{{$parent.readonly}}" :style="{ height: $parent.height ? $parent.height + 'px' : '' }"/>`;
          } else {
            this.$options.template = `<input class="d-texteditor-editor" @focus="$parent.handleFocus" @blur="$parent.handleBlur" @keydown="$parent.handleKeydown($event)" ${lazy ? 'lazy' : ''} type="${parent.editorType}" v-model="$parent.visualValue" placeholder="{{$parent.placeholder}}" :style="{ height: $parent.height ? $parent.height + 'px' : '' }" readonly="{{$parent.readonly}}" />`;
          }
        }
      }
    },

    methods: {
      handleClear() {
        this.value = null;
      },

      handleChange(event) {
        // this.hideDatePicker();
      },

      handleFocus() {
        const type = this.type;
        if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1) {
          if (!this.pickerVisible) {
            this.showDatePicker();
          }
        }
        this.$emit('focus', this);
      },

      handleBlur() {
        this.$emit('blur', this);
      },

      handleKeydown(event) {
        var keyCode = event.keyCode;
        if (!this.editable && FUNCTION_KEYS.indexOf(keyCode) === -1) {
          event.preventDefault();
        }

        if (keyCode === 27) {
          this.pickerVisible = false;
        }
      },

      onDocumentClick() {
        this.hideDatePicker();
      },

      toggleDatePicker() {
        if (!this.pickerVisible) {
          this.showDatePicker();
        } else {
          this.hideDatePicker();
        }
      },

      hideDatePicker() {
        if (this.picker) {
          this.picker.resetView && this.picker.resetView();
          this.picker.$el.style.display = 'none';
          this.pickerVisible = false;
        }
      },

      getPickerClass() {
        const type = this.type;
        if (type === 'time') {
          return require('./picker/time-picker.vue');
        } else if (type === 'timerange') {
          return require('./picker/time-range-picker.vue');
        } else if (type === 'daterange' || type === 'datetimerange') {
          return require('./picker/date-range-picker.vue');
        } else {
          return require('./picker/date-picker.vue');
        }
      },

      showDatePicker() {
        const Picker = this.getPickerClass();

        if (!this.picker) {
          this.picker = new Vue(merge({ el: document.createElement('div'), replace: true }, Picker));
          this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
          this.picker.selectionMode = this.selectionMode;
          if (this.format) {
            this.picker.format = this.format;
          }
          this.picker.$appendTo(this.$el);

          this.pickerVisible = true;

          this.picker.$on('pick', (date) => {
            this.value = date;
            this.picker.$el.style.display = 'none';
            this.pickerVisible = false;
            this.picker.resetView && this.picker.resetView();
          });
        } else {
          this.picker.$el.style.display = '';
          this.pickerVisible = true;
          if (this.value instanceof Date) {
            this.picker.date = new Date(this.value.getTime());
            this.picker.resetView && this.picker.resetView();
          }
        }
      }
    }
  };
</script>