<template>
  <v-simple-table>
    <thead>
      <tr>
        <th class="text-xs-left"></th>
        <th class="text-xs-left">Name</th>
        <th v-if="deviceGroup.ownerColumn" class="text-xs-left">{{ deviceGroup.ownerColumn }}</th>
        <th class="text-xs-left">Type</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="device in deviceGroup.devices" :key="device.id">
        <td>
          <font-awesome-icon size="sm" :icon="typeToIcon(device.type)" color="#a9afbb" />
        </td>
        <td class="body-2 font-weight-light">
          <a link :href="'#/device/' + device.id">{{ device.name }}</a>
        </td>
        <td
          v-if="deviceGroup.ownerColumn"
          class="body-2 font-weight-light"
        >{{ getOwnerColumn(device) }}</td>
        <td class="body-2 font-weight-light">{{ device.type }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import { typeToIcon } from "../components/helpers";

export default {
    props: ['deviceGroup', 'getOwnerColumn'],
    methods: {
        typeToIcon,
    }
}
</script>
