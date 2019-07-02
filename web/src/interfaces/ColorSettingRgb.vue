<template>
    <div class="form-group">
        <div class="form-group col">
            <label>Color (RGB)</label>
            <div ref='color'></div>
        </div>
    </div>
</template>

<script>
import ColorSetting from './ColorSetting.vue';

export default {
    mixins: [ColorSetting],
    mounted: function() {
        $(this.$refs.color)
        .colorpicker({
            inline: true,
            container: true,
            useAlpha: false,
            format: 'rgb',
            color: `rgb(${this.value.rgb.r}, ${this.value.rgb.g}, ${this.value.rgb.b})`
        })
        .on('colorpickerChange', this.maybeDebounce(e => {
            const {r, g, b} = eval(`(function() { function rgb(r, g, b) { return { r, g, b } }; return ${e.color.toRgbString()} })()`);
            this.value.r = r;
            this.value.g = g;
            this.value.b = b;
            this.rpc().setRgb(r, g, b);
        }));
    },
};
</script>
