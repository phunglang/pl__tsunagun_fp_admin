<template>
<div>
    <div class="navbar-bg"></div>
    <nav class="navbar navbar-expand-lg main-navbar" id="main-navbar">
        <form class="form-inline mr-auto">
            <ul class="navbar-nav mr-3">
                <li>
                    <b-button variant="light" v-b-toggle.main-sidebar>
                        <i class="fas fa-bars"></i>
                    </b-button>
                </li>
            </ul>
        </form>
        <ul class="navbar-nav navbar-right">
            <li class="dropdown">
                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <img class="rounded-circle mr-1 navbar-avatar" alt="image" src="/admin/upload/avatar-1.png">
                    </template>
                    <b-dropdown-item href="#" v-on:click="logout">ログアウト</b-dropdown-item>
                </b-nav-item-dropdown>
            </li>
        </ul>
    </nav>
</div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
export default Vue.extend({
    methods: {
         ...mapActions(['handleCrudAPIAdmin', 'handleLogout']),
        logout() {
            this.handleLogout();
            this.$router.push({
                path:'/admin'
            })
        }
    },
     computed: {
        ...mapGetters([
            'getTokens',
        ])
    },
})
</script>

<style>
.navbar {
    position: fixed;
}
</style>
