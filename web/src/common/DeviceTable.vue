<template>
  <v-simple-table>
    <thead>
      <tr>
        <th style="width: 10px;" class="text-xs-left"></th>
        <th class="text-xs-left">Name</th>
        <th v-if="deviceGroup.ownerColumn" class="text-xs-left">{{ deviceGroup.ownerColumn }}</th>
        <th v-if="!hideType" class="text-xs-left">Type</th>
      </tr>
    </thead>
    <tbody v-if="deviceGroup.devices.length">
      <tr v-for="device in deviceGroup.devices" :key="device.id">
        <td>
          <font-awesome-icon size="sm" :icon="typeToIcon(device.type)" color="#a9afbb" />
        </td>
        <td class="body-2 font-weight-light">
          <a link :href="'#' + getDeviceViewPath(device.id)">{{ device.name }}</a>
        </td>
        <td v-if="deviceGroup.ownerColumn && getOwnerLink(device)" class="body-2 font-weight-light">
          <a :href="getOwnerLink(device)">{{ getOwnerColumn(device) }}</a>
        </td>
        <td
          v-else-if="deviceGroup.ownerColumn"
          class="body-2 font-weight-light"
        >{{ getOwnerColumn(device) }}</td>
        <td v-if="!hideType" class="body-2 font-weight-light">{{ device.type }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <td></td>
        <td class="body-2 font-weight-light">None found.</td>
    </tbody>
  </v-simple-table>
</template>

<script>
import { typeToIcon, getDeviceViewPath } from "../components/helpers";

export default {
  props: ["deviceGroup", "getOwnerColumn", "getOwnerLink", "hideType"],
  methods: {
    getDeviceViewPath,
    typeToIcon
  }
};
</script>
