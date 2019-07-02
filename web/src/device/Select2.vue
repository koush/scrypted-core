<template>
    <v-autocomplete :multiple="multiple" :items="options" v-model="value" :label="label">
    
    </v-autocomplete>
</template>

<script>
export default {
    props: ['label', 'options', 'value', 'unselected', 'multiple'],
}
</script>