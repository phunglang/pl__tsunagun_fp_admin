<template>
<main>
    <main-navbar></main-navbar>
    <main-sidebar :sidebar="page_data.sidebar"></main-sidebar>
    <div class="main-wrapper">
        <!-- Main Content-->
        <div class="main-content" id="main-content">
            <section class="section">
                <div class="section-header">
                    <h1>{{typeof page_data.bread_crumbs != 'undefined' ? page_data.bread_crumbs[0].text : ''}}</h1>
                    <div class="section-header-breadcrumb flex-wrap custom-breadcrumb">
                        <!-- <b-breadcrumb :items="$route.meta.breadcrumb"></b-breadcrumb> -->
                        <b-breadcrumb :items="page_data.bread_crumbs" class="mb-0"></b-breadcrumb>
                    </div>
                </div>
                <div class="section-body">
                    <h2 class="section-title"> {{ page_data.title }} </h2>
                    <!-- <p class="section-lead" v-html="$route.meta.titleDecription"></p> -->
                    <!-- <router-view :key="$route.path"  ></router-view> -->
                    <Nuxt />
                </div>
            </section>
        </div>
    </div>
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
    middleware: 'authenticated',
    metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'エフコネ',
        // all titles will be injected into this template
        link: [
            {
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
            {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
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
    computed: {
        page_data() {
            return this.$store.getters.getPageData;
        }
    },
    methods: {
    },
    created() {
        console.log("ok");
    },
})
</script>

<style scoped>
/* .navbar {
    position: relative;
} */
</style>
