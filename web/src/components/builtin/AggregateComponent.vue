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
            "Combine multiple devices into a single virtual device.",
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