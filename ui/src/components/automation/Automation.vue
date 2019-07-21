<template>
  <v-flex>
    <v-card
      raised
      class="header-card"
      v-if="device.automationType !== 'Scene'"
      style="margin-bottom: 60px"
    >
      <v-card-title
        class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
      >
        <font-awesome-icon size="sm" icon="bolt" />
        <span class="title font-weight-light">&nbsp;&nbsp;Automation Triggers</span>
      </v-card-title>

      <div class="header-card-spacer"></div>
      <v-card-text>Specify the events (and optional conditions) that will trigger the automation.</v-card-text>

      <v-form>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <EventsPicker
                :name="device.triggers.name"
                :events="deviceProps.automationData.events"
                :interfaces="deviceProps.automationData.interfaces"
                v-model="device.triggers.triggers"
                @input="onChange"
              ></EventsPicker>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    @input="onChange"
                    v-on="on"
                    v-model="device.denoiseEvents"
                    label="Denoise All Events"
                  ></v-checkbox>
                </template>
                <span>Denoising events will suppress events where the same event data is sent multiple times in a row. For example, if a sensor sent multiple door open events, only the first event will trigger this automation. The automation will fire again once the door sends a close event.</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    @input="onChange"
                    v-on="on"
                    v-model="device.staticEvents"
                    label="Reset Automation on All Events"
                  ></v-checkbox>
                </template>
                <span>By default, running Automation timers will be reset if the same device fires the event again. Check this box to reset Automation timers on all of the configured events.</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    @input="onChange"
                    v-on="on"
                    v-model="device.resetOnCompletion"
                    label="Run Automations to Completion"
                  ></v-checkbox>
                </template>
                <span>By default, autotomations that are executing will reset if triggered by a new event. Check this box to require an automation to run to completion before it can be triggered again. Tthis setting can be used in conjunction with a timer to prevent an automation from running too often.</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>

    <v-card raised class="header-card" style="margin-bottom: 60px">
      <v-card-title
        class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
      >
        <font-awesome-icon size="sm" icon="play" />
        <span v-if="device.automationType !== 'Scene'">&nbsp;&nbsp;Automation Actions</span>
        <span v-else>&nbsp;&nbsp;Scene Activation Actions</span>
      </v-card-title>

      <div class="header-card-spacer"></div>
      <v-card-text
        v-if="device.automationType !== 'Scene'"
      >Specify action(s) to take when the automation is triggered.</v-card-text>
      <v-card-text v-else>Specify action(s) to take when the scene is activated.</v-card-text>

      <v-form>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <InterfacesPicker
                :name="device.actions.name"
                :interfaces="contextualInterfaces"
                v-model="device.actions.actions"
                @input="onChange"
              ></InterfacesPicker>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>

    <v-card raised class="header-card" v-if="device.automationType === 'Scene'">
      <v-card-title
        class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
      >
        <font-awesome-icon size="sm" icon="play" />
        <h5 class="card-title">&nbsp;&nbsp;Scene Deactivation Actions</h5>
      </v-card-title>
      <div class="header-card-spacer"></div>
      <v-card-text>Specify action(s) to take when the scene deactivated.</v-card-text>

      <v-form>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <InterfacesPicker
                :name="device.deactivateActions.name"
                :interfaces="contextualInterfaces"
                v-model="device.deactivateActions.actions"
                @input="onChange"
              ></InterfacesPicker>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>
  </v-flex>
</template>
<script>
import InterfacesPicker from "./InterfacesPicker.vue";
import EventsPicker from "./EventsPicker.vue";
import cloneDeep from "lodash.clonedeep";
import { ScryptedInterface } from "@scrypted/sdk";

const includeContextual = [
  ScryptedInterface.OnOff,
  ScryptedInterface.Lock,
  ScryptedInterface.StartStop,
  ScryptedInterface.Scene,
  ScryptedInterface.Entry,
  ScryptedInterface.TemperatureSetting
];

export default {
  data() {
    const {
      triggers,
      actions,
      deactivateActions,
      staticEvents,
      denoiseEvents,
      resetOnCompletion,
      automationType
    } = this.deviceProps.automationData;
    return {
      device: cloneDeep({
        triggers,
        actions,
        deactivateActions,
        staticEvents,
        denoiseEvents,
        resetOnCompletion,
        automationType
      })
    };
  },
  props: ["value", "deviceProps"],
  components: {
    InterfacesPicker,
    EventsPicker
  },
  computed: {
    mappedEvents: {
      get: function() {
        var ret = {};
        for (var event of this.deviceProps.automationData.events) {
          ret[event.id] = event;
        }
        return ret;
      }
    },
    contextualInterfaces: {
      get: function() {
        var ret = [];
        var triggeredEvents = {};
        for (var trigger of this.device.triggers.triggers) {
          trigger = this.mappedEvents[trigger.id];
          if (!trigger || !trigger.component) continue;
          triggeredEvents[trigger.component] = trigger.component;
        }
        var contextual = Object.values(triggeredEvents)
        .filter(component => includeContextual.includes(component))
        .map(component => ({
          component: component,
          id: `AutomationTrigger#${component}`,
          properties: {},
          text: `Automation Trigger (${component})`,
          action: true
        }));
        Array.prototype.push.apply(ret, contextual);
        Array.prototype.push.apply(
          ret,
          this.deviceProps.automationData.interfaces
        );
        return ret;
      }
    }
  },
  // mounted() {
  //   // this is a hack until device is propertly send across from the java side.
  //   this.onChange();
  // },
  methods: {
    onChange() {
      this.$emit("input", this.device);
    }
  }
};
</script>
