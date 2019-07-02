<template>
    <div class="card col-12 col-lg-6">
        <div class="card-header">
            <h5 class="card-title">Passcodes</h5>
        </div>
        <div class="card-body">
            <div class="form-group">
                <div v-for="password in passwordData" :key="password.key" class="input-group">
                    <input :readonly="password.saved" :type="passwordType(password)" class="form-control" v-model="password.password">
                    <span class="input-group-append">
                        <button style="width: 40px" :class="{ 'd-none': password.confirm || !password.saved }" class="btn btn-outline-info" type="button" @click="changeVisible(password)"><i class="fas fa-eye-slash"></i></button>
                        <button style="width: 40px" :class="{ 'd-none': !password.confirm || !password.saved }" class="btn btn-outline-danger" type="button" @click="cancelDelete(password)"><i class="fas fa-ban"></i></button>
                        <button style="width: 40px" @click="confirmDelete(password)" class="btn" :class="[ password.confirm ? 'btn-danger' : 'btn-outline-danger', { 'd-none': !password.saved } ]" type="button"><i class="fas fa-trash-alt"></i></button>
                        <button style="width: 40px" :class="{ 'd-none': password.saved }" @click="savePassword(password)" class="btn btn-success" type="button"><i class="fas fa-check"></i></button>
                    </span>
                </div>
            </div>
            <button type="button" class="button btn-secondary" @click="addPassword">Add</button>
        </div>
    </div>
</template>
<script>
import RPCInterface from './RPCInterface.vue'

export default {
    mixins: [RPCInterface],
    data: function() {
        var passwordData = this.value.passwords.map(p => ({
            key: Math.random().toString(),
            password: p,
            confirm: false,
            visible: false,
            saved: true,
        }));
        return {
            passwordData,
        };
    },
    methods: {
        passwordType(password) {
            return password.visible ? 'text' : 'password';
        },
        changeVisible: function(password) {
            password.visible = !password.visible;
        },
        cancelDelete: function(password) {
            password.confirm = false;
        },
        confirmDelete: function(password) {
            if (password.confirm) {
                this.rpc().removePassword(password.password);
                this.passwordData = this.passwordData.filter(p => p.password != password.password);
            }
            else {
                password.confirm = true;
            }
        },
        savePassword: function(password) {
            this.rpc().addPassword(password.password);
            password.saved = true;
            password.visible= false;
        },
        addPassword: function() {
            this.passwordData.push({
                key: Math.random().toString(),
                password: '',
                confirm: false,
                visible: true,
                saved: false,
            })
        }
    },
}
</script>