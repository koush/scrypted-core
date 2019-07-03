<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs3 md2 lg2 xl1 v-for="day of days" :key="day">
      <v-btn
        block
        class="white--text"
        @click="toggleDay(day)"
        color="info"
        small
        :text="!$data[day]"
      >{{ day.substring(0, 3) }}</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-layout justify-center align-center>
        <v-time-picker v-model="time" format="24hr"></v-time-picker>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-layout justify-center align-center>
        <v-flex xs12 md8 lg6 xl4>
          <v-select
            xs3
            :items="clockTypes"
            solo
            item-value="id"
            v-model="clockType"
            @change="onChange"
          ></v-select>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
import RPCInterface from "../RPCInterface.vue";
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const hours = [];
const minutes = [];

function zeroPrefix(arr, len) {
  for (var i = 0; i <= len; i++) {
    arr.push(i >= 10 ? i.toString() : "0" + i);
  }
}

zeroPrefix(hours, 24);
zeroPrefix(minutes, 59);

export default {
  mixins: [RPCInterface],
  data: function() {
    var ret = {
      hours,
      minutes,
      days,
      hour: this.value.hour || "00",
      minute: this.value.minute || "00",
      clockType: this.value.clockType || "AM",
      clockTypes: [
        {
          id: "AM",
          text: "AM"
        },
        {
          id: "PM",
          text: "PM"
        },
        {
          text: "24 Hour Clock",
          id: "TwentyFourHourClock"
        },
        {
          text: "Before Sunrise",
          id: "BeforeSunrise"
        },
        {
          text: "After Sunrise",
          id: "AfterSunrise"
        },
        {
          text: "Before Sunset",
          id: "BeforeSunset"
        },
        {
          text: "After Sunset",
          id: "AfterSunset"
        }
      ]
    };

    for (var day of days) {
      ret[day] = !!this.value[day];
    }
    return ret;
  },
  computed: {
    time: {
      get() {
        return `${this.value.hour}:${this.value.minute}`;
      },
      set(value) {
        this.hour = parseInt(value.split(':')[0]);
        this.minute = parseInt(value.split(':')[1]);
        this.onChange();
      }
    }
  },
  methods: {
    toggleDay: function(day) {
      this[day] = !this[day];
      this.onChange();
    },
    onChange: function() {
      var schedule = {};
      for (var day of days) {
        schedule[day] = this.value[day] = this.$data[day];
      }
      schedule.hour = this.value.hour = this.hour;
      schedule.minute = this.value.minute = this.minute;
      schedule.clockType = this.value.clockType = this.clockType;
      this.rpc().schedule(schedule);
      this.$emit('input', this.value);
    }
  }
};
</script>

<style>
.no-arrow {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.semicolon-pad {
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 4px;
}
</style>