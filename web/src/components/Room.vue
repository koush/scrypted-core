<template>
  <v-flex>
    <v-card raised color="green" dark class="mx-auto">
      <v-card-title>{{ item.name }}</v-card-title>

      <v-list-item v-for="(devices, type) in item.types" :key="type">
        <v-list-item-content>
          <v-list-item-title>{{ type }}</v-list-item-title>
        </v-list-item-content>
        <v-switch light inset color="white" class="text--white"></v-switch>
      </v-list-item>
    </v-card>
  </v-flex>
</template>
<script>
export default {
    name: "Room",
    props: {
        item: Object,
    },
    created() {
        console.log(this);
    }
}
</script>
