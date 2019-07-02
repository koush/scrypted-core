<template>
    <div style='margin-left: 5px;'>
        <div class="form-row btn-group btn-group-sm mb-3" role="group" aria-label="Large button group">
            <button @click="toggleDay(day)" v-for="day of days" :key="day" type="button" class="btn" :class="[ $data[day] ? 'btn-info' : 'btn-outline-info' ]">{{ day }}</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <select class="form-control no-arrow" @change="onChange" v-model="hour">
                    <option :value="hour" v-for="hour of hours" :key="hour">{{ hour }}</option>
                </select>
            </div>
            <div class="semicolon-pad">:</div>
            <div class="form-group">
                <select class="form-control no-arrow" @change="onChange" v-model="minute">
                    <option :value="minute" v-for="minute of minutes" :key="minute">{{ minute }}</option>
                </select>
            </div>
            <div class="form-group">
                <select class="form-control no-arrow" @change="onChange" v-model="clockType">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                    <option value="TwentyFourHourClock">24 Hour Clock</option>
                    <option value="BeforeSunrise">Before Sunrise</option>
                    <option value="AfterSunrise">After Sunrise</option>
                    <option value="BeforeSunset">Before Sunset</option>
                    <option value="AfterSunset">After Sunset</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import RPCInterface from '../RPCInterface.vue'
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const hours = [];
const minutes = [];

function zeroPrefix(arr, len) {
    for (var i = 0; i <= len; i++) {
        arr.push(i >= 10 ? i.toString() : '0' + i);
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
            hour: this.value.hour || '00',
            minute: this.value.minute || '00',
            clockType: this.value.clockType || 'AM',
        }

        for (var day of days) {
            ret[day] = !!this.value[day];
        }
        return ret;
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
        }
    }
}
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