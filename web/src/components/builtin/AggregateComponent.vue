<script>
import BasicComponent from "./BasicComponent.vue";

export default {
  mixins: [BasicComponent],
  data() {
    return {
      cards: [
        {
          body: null,
          buttons: [
            {
              method: "POST",
              path: "new",
              title: "Create Device Group",
              value: "automation"
            }
          ],
          description:
            "Combine multiple devices into a single virtual device. Commands sent to the device group will be sent to all the devices in that group.",
          title: "New Device Group"
        },
      ],
      component: {
        icon: "folder-plus",
        id: "aggregate",
        name: "Device Groups"
      }
    };
  }
};
</script>