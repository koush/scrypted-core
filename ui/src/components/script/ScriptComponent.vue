<script>
import BasicComponent from "../BasicComponent.vue";
import PluginUpdate from "./PluginUpdate.vue";

export default {
  mixins: [BasicComponent],
  methods: {
    getOwnerColumn(device) {
      return device.metadata.npmPackage;
    },
    getOwnerLink(device) {
      return `https://www.npmjs.com/package/${device.metadata.npmPackage}`;
    }
  },
  data() {
    var self = this;
    return {
      cards: [
        {
          body: null,
          buttons: [
            {
              method: "GET",
              path: "install",
              title: "Install Plugin",
              click() {
                self.$router.push(`${self.componentViewPath}/install`);
              }
            }
          ],
          description:
            "Integrate your existing smart home devices and services.",
          title: "Install Plugin"
        },
        {
          body: null,
          buttons: [
            {
              method: "POST",
              path: "new",
              title: "Create Script",
              click() {
                self.newDevice();
              }
            }
          ],
          description:
            "Write custom scripts to automate events or add new devices.",
          title: "Create New Script"
        }
      ],
      resettable: true,
      component: {
        icon: "zap",
        id: "script",
        name: "Plugins"
      }
    };
  },
  computed: {
    deviceGroups() {
      const ids = Object.keys(this.$store.state.systemState);
      const devices = ids
        .map(id => this.$scrypted.systemManager.getDeviceById(id))
        .filter(
          device => device.component === this.component.id && !device.owner
        );

      return [
        {
          name: "Plugins",
          ownerColumn: "Plugin Package",
          devices: devices.filter(device => device.metadata.npmPackage),
          hideType: true,
          tableProps: {
            extraColumn0: "Version"
          },
          extraColumn0: PluginUpdate,
        },
        {
          name: "Scripts",
          devices: devices.filter(
            device =>
              !device.metadata.npmPackage && !device.metadata.ownerPlugin
          )
        }
      ];
    }
  }
};
</script>