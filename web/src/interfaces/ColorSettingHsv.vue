<template>
    <div class="form-group">
        <div class="form-group col">
            <label>Color (HSV)</label>
            <div ref='color'></div>
        </div>
    </div>
</template>

<script>
import ColorSetting from './ColorSetting.vue';

export default {
    mixins: [ColorSetting],
    mounted: function() {
        $(this.$refs.color).colorpicker({
            inline: true,
            container: true,
            useAlpha: false,
            format: 'hsl',
            color: `hsl(${this.value.hsv.h}, ${this.value.hsv.s * 100}%, ${this.value.hsv.v * 100}%)`
        })
        .on('colorpickerChange', this.maybeDebounce(e => {
            this.value.hue = Math.round(e.color.hue);
            this.value.saturation = Math.round(e.color.saturation);
            this.value.value = Math.round(e.color.value);
            this.rpc().setHsv(this.value.hue, this.value.saturation / 100, this.value.value / 100);
        }));
    },
};
</script>
