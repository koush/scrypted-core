<template>
    <div>
        <button class="btn btn-info mb-3"  :class="{'d-none': editableSettings.length <= 5}" @click="collapse">
            Settings
        </button>
        <div class="card col-12 col-lg-6" :class="{collapse: editableSettings.length > 5}" ref="collapse">
            <div class="card-header">
                <h5 class="card-title">Settings</h5>
            </div>
            <div class="card-body">
                <div v-for="setting in editableSettings" :key="setting.key" class="form-group">
                    <label data-toggle="tooltip" data-placement="top" :title="setting.description">{{ setting.title || setting.key }}</label>
                    <div class="input-group">
                        <input v-if="!setting.choices || !setting.choices.length" class="form-control" v-model="setting.editValue" :placeholder="setting.placeholder"
                            :readonly="!!setting.readonly">
                        <select v-else v-model='setting.editValue' class="form-control">
                            <option v-for="option of setting.choices" :key="option" :value="option">{{ option }}</option>
                        </select>
                        <button v-if="setting.editValue !== setting.value" @click="saveSetting(setting)" style="width: 40px" class="btn btn-success" type="button"><i class="fas fa-check"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import RPCInterface from './RPCInterface.vue';

export default {
    mixins: [RPCInterface],
    data: function() {
        var data = {
            editableSettings: this.createEditableSettings(this.value.settings),
        }
        return data;
    },
    mounted: function() {
        $(this.$el).find('[data-toggle="tooltip"]').tooltip()
    },
    methods: {
        createEditableSettings: function(settings) {
            return settings.map(setting => Object.assign({
                editValue: setting.value,
            }, setting));
        },
        options: function(choices) {
            return choices.map(choice => ({
                id: choice,
                text: choice
            }));
        },
        collapse: function() {
            $(this.$refs.collapse).collapse('toggle');
        },
        saveSetting: function(setting) {
            this.rpc().putSetting(setting.key, setting.editValue)
            .then(() => {
                if (!this.device) {
                    return;
                }
                return this.rpc().getSettings();
            })
            .then(response => response.json())
            .then(json => {
                this.$data.editableSettings = this.createEditableSettings(json);
            })
            setting.value  = setting.editValue;
        }
    }
}
</script>
