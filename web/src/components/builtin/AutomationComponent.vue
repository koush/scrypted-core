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
              title: "Create Automation",
              value: "automation"
            }
          ],
          description:
            "Create custom smart home scenes that control multiple devices.",
          title: "Create New Automation"
        },
        {
          body: null,
          buttons: [
            {
              method: "POST",
              path: "new",
              title: "Create Scene",
              value: "scene"
            }
          ],
          description:
            "Create custom smart home scenes that control multiple devices.",
          title: "Create New Scene"
        }
      ],
      resettable: true,
      component: {
        icon: "activity",
        id: "automation",
        name: "Automations"
      }
    };
  }
};
</script>