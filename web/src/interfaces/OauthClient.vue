<template>
    <div class="form-group">
        <button type="button" class='btn btn-success' @click='onClick'>Authorize</button>
    </div>
</template>
<script>
import RPCInterface from './RPCInterface.vue'
import qs from 'qs'


export default {
    mixins: [RPCInterface],
    mounted: function() {
        // this is an implicit command, so immediately trigger the change.
        if (!this.device) {
            this.onClick();
        }
    },
    methods: {
        onClick: function() {
            this.rpc().getOauthUrl()
            .then(response => response.json() )
            .then(data => {
                var url = new URL(data.result);
                var querystring = qs.parse(url.search.replace('?', ''));
                querystring.redirect_uri= `https://${window.scryptedDomain}/web/oauth/callback`;
                querystring.state = JSON.stringify(
                {
                    d: this.device,
                    s: querystring.state,
                });
                url.search = qs.stringify(querystring)
                window.location = url.toString();
            })
        },
    }
};
</script>