<template>
  <v-flex xs12 md6 lg6>
    <v-card
      raised
      class="header-card"
      v-if="automationType !== 'Scene'"
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
                :name="triggers.name"
                :events="events"
                :interfaces="interfaces"
                v-model="triggers.triggers"
                @change="onChange"
              ></EventsPicker>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox v-on="on" v-model="denoiseEvents" label="Denoise All Events"></v-checkbox>
                </template>
                <span>Denoising events will suppress events where the same event data is sent multiple times in a row. For example, if a sensor sent multiple door open events, only the first event will trigger this automation. The automation will fire again once the door sends a close event.</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    v-on="on"
                    v-model="staticEvents"
                    label="Reset Automation on All Events"
                  ></v-checkbox>
                </template>
                <span>By default, running Automation timers will be reset if the same device fires the event again. Check this box to reset Automation timers on all of the configured events.</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    v-on="on"
                    v-model="resetOnCompletion"
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

    <v-card raised class="header-card">
      <v-card-title
        class="green-gradient subtitle-1 text--white header-card-gradient font-weight-light"
      >
        <font-awesome-icon size="sm" icon="play" />
        <span v-if="automationType !== 'Scene'">&nbsp;&nbsp;Automation Actions</span>
        <span v-else>&nbsp;&nbsp;Scene Activation Actions</span>
      </v-card-title>

      <div class="header-card-spacer"></div>
      <v-card-text
        v-if="automationType !== 'Scene'"
      >Specify action(s) to take when the automation is triggered.</v-card-text>
      <v-card-text v-else>Specify action(s) to take when the scene is activated.</v-card-text>

      <v-form>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <InterfacesPicker
                :name="actions.name"
                :interfaces="contextualInterfaces"
                v-model="actions.actions"
                @change="onChange"
              ></InterfacesPicker>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>

    <div v-if="automationType === 'Scene'" class="card col-12 col-lg-6">
      <div class="card-header">
        <h5 class="card-title">Scene Dectivation Actions</h5>
        <h6 class="card-subtitle text-muted">Specify action(s) to take when the scene deactivated.</h6>
      </div>

      <InterfacesPicker
        :name="deactivateActions.name"
        :interfaces="contextualInterfaces"
        v-model="deactivateActions.actions"
                @change="onChange"
      ></InterfacesPicker>
    </div>
  </v-flex>
</template>
<script lang="ts">
import InterfacesPicker from "../common/InterfacesPicker.vue";
import EventsPicker from "../common/EventsPicker.vue";


export default {
  data() {
    return this.value.automationData;
  },
  props: ["value"],
  components: {
    InterfacesPicker,
    EventsPicker,
  },
  computed: {
    mappedEvents: {
      get: function() {
        var ret = {};
        for (var event of this.events) {
          ret[event.id] = event;
        }
        return ret;
      }
    },
    contextualInterfaces: {
      get: function() {
        var ret = [];
        var triggeredEvents = {};
        for (var trigger of this.triggers.triggers) {
          trigger = this.mappedEvents[trigger.id];
          if (!trigger || !trigger.component) continue;
          triggeredEvents[trigger.component] = trigger.component;
        }
        var contextual = Object.values(triggeredEvents).map(component => ({
          component: component,
          id: `AutomationTrigger#${component}`,
          properties: {},
          text: `Automation Trigger (${component})`,
          action: true
        }));
        Array.prototype.push.apply(ret, contextual);
        Array.prototype.push.apply(ret, this.interfaces);
        return ret;
      }
    }
  },
  watch: {
    'actions.actions': function() {
      console.log(this.value);
    }
  },
  methods: {
    onChange: function() {
      console.log(this.value);
    }
  }
};
</script>
