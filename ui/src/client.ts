import Vue from "vue";
import client from "@scrypted/client";
import axios from 'axios';
import store from './store';

function hasValue(state, property) {
    return state[property] && state[property].value;
}

function isValidDevice(id) {
    const state = store.state.systemState[id];
    for (var property of [
        "id",
        "name",
        "interfaces",
        "component",
        "events",
        "metadata",
        "type"
    ]) {
        if (!hasValue(state, property)) {
            return false;
        }
    }
    return true;
}

Vue.use(Vue => {
    Vue.prototype.$connectScrypted = () => {
        const clientPromise = client.connect(null);

        store.commit("setHasLogin", undefined);
        store.commit("setIsLoggedIn", undefined);
        store.commit("setUsername", undefined);
        store.commit("setIsConnected", undefined);
        store.commit("setIsLoggedIntoCloud", undefined);

        return axios
            .get("/login", {
                headers: {
                    Accept: "application/json"
                }
            })
            .then(response => {
                if (!response.data.expiration) {
                    if (response.data.redirect) {
                        store.commit("setIsLoggedIntoCloud", false);
                    }
                    store.commit("setHasLogin", response.data.hasLogin);
                    throw new Error("Login failed.");
                }
                store.commit("setHasLogin", true);
                store.commit("setIsLoggedIn", true);
                store.commit("setUsername", response.data.username);
                setTimeout(() => {
                    store.commit("setIsLoggedIn", false);
                }, response.data.expiration);
                return clientPromise;
            })
            .catch(e => {
                store.commit("setIsLoggedIn", false);
                throw e;
            })
            .then(scrypted => {
                Vue.prototype.$scrypted = scrypted;
                // system state is returned as a reference and updated by the scrypted client, so passing it to vue allows direct model updates.
                // this is not the same behavior as on android. fix?
                const systemState = scrypted.systemManager.getSystemState();
                store.commit("setSystemState", systemState);
                store.commit("setDevices", Object.keys(systemState));
                store.commit("setIsConnected", true);

                scrypted.onClose = () => {
                    store.commit("setIsConnected", false);
                };

                scrypted.systemManager.listen(
                    (eventSource, eventDetails, eventData) => {
                        if (eventSource) {
                            const id = eventSource.id;

                            if (eventDetails.property === "id" && !eventData) {
                                Vue.delete(systemState, id);
                                store.commit("removeDevice", id);
                                return;
                            }

                            // ensure the property is reactive
                            if (eventDetails.eventInterface == "ScryptedDevice") {
                                Vue.set(systemState, id, systemState[id]);
                                if (isValidDevice(id)) {
                                    store.commit("addDevice", id);
                                }
                                return;
                            }
                        } else if (eventDetails.eventInterface == "Logger") {
                            store.commit("addAlert", eventData);
                        }
                    }
                );

                scrypted.rpc("this", "getAlerts", []).then(alerts => {
                    store.commit("setAlerts", alerts);
                });
            })
            .catch(e => {
                store.commit("setIsConnected", false);
                throw e;
            });
    };

    Vue.prototype.$connectScrypted();
});