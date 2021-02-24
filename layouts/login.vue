<template>
<main>
   <Nuxt />
</main>
</template>

<script lang="ts">
import Vue from 'vue'
import VueMeta from 'vue-meta'
import {
    mapActions,
    mapGetters,
} from "vuex";
Vue.use(VueMeta)
export default Vue.extend({
    middleware: 'notAuthenticated',
    metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'admin title',
        // all titles will be injected into this template
        titleTemplate: '%s | My Awesome Webapp',
        link: [{
                rel: 'stylesheet',
                href: '/admin/scss/pages/bootstrap.min.css'
            },
            {
                rel: 'stylesheet',
                href: '/admin/scss/pages/all.css'
            },
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/admin/upload/favicon.ico'
            },
            {
                rel: 'stylesheet',
                href: '/admin/scss/plugins.min.css'
            },
            {
                rel: 'stylesheet',
                href: '/admin/scss/style.css'
            },
            {
                rel: 'stylesheet',
                href: '/admin/scss/customAdmin.css'
            },
        ],
        script: [{
                src: "/admin/js/jquery.js",
                type: "text/javascript"
            },
            {
                src: '/admin/js/stisla.js',
                type: 'text/javascript',
                body: true
            },
            {
                src: '/admin/js/popper.min.js',
                type: 'text/javascript',
                body: true
            },
            {
                src: '/admin/js/jquery.nicescroll.min.js',
                type: 'text/javascript',
                body: true
            },
            {
                src: '/admin/js/moment.min.js',
                type: 'text/javascript',
                body: true
            },
            {
                src: '/admin/js/pages.js',
                type: 'text/javascript',
                body: true
            }
        ]
    },
})
</script>

<style scoped>
/* .navbar {
    position: relative;
} */
</style>
