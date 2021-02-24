<template>
<div class="main-sidebar" id="main-sidebar-contant">
    <b-sidebar id="main-sidebar" title="" shadow :visible="isOpen" v-on:hidden="sidebarHide" v-on:shown="sidebarShow" no-header :no-close-on-route-change="true">
    <aside id="sidebar-wrapper">
        <ul class="sidebar-menu mt-2 pb-5">
            <li class="menu-header"> <strong>エフコネ</strong> 管理画面</li>

            <li :class="{ active: page_data.sidebar == 'validation-id'}">
                <NuxtLink to="/admin/validation/id-card">
                    <i class="fas fa-id-card" aria-hidden="true"></i>
                    <span>身分証を認証する</span>
                 </NuxtLink>
            </li>
            
            <li :class="{ active: page_data.sidebar == 'validation-skills'}">
                <NuxtLink to="/admin/validation/skills">
                    <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                    <span>スキル/資格を認証する</span>
                </NuxtLink>
            </li>
           
            <li :class="{ active: page_data.sidebar == 'users' }">
                <NuxtLink to="/admin/users">
                    <i class="fas fa-user-circle" aria-hidden="true"></i>
                    <span>ユーザー 管理</span>
                </NuxtLink>
            </li>
            
            <li :class="{ active: page_data.sidebar == 'category' }">
                <NuxtLink to="/admin/category">
                    <i class="fas fa-tag" aria-hidden="true"></i>
                    <span>スキル/資格マスタ</span>
                </NuxtLink>
            </li>
            
            <li :class="{ active: page_data.sidebar == 'admin-post' }">
                <NuxtLink to="/admin/admin-post">
                    <i class="fas fa-bullhorn" aria-hidden="true"></i>
                    <span>運営からのお知らせ</span>
                </NuxtLink>
            </li>
            
            <li :class="{ active: page_data.sidebar == 'user-post' }">
                <NuxtLink to="/admin/user-post">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    <span>自由投稿管理</span>
                </NuxtLink>
            </li>
            
            <li  :class="{ active: page_data.sidebar == 'jobs'}">
                <NuxtLink to="/admin/jobs">
                    <i class="fa fa-briefcase" aria-hidden="true"></i>
                    <span>仕事投稿管理</span>
                </NuxtLink>
            </li>
            
            <li  :class="{ active: page_data.sidebar == 'ng-word' }">
                <NuxtLink to="/admin/ng-word">
                    <i class="fas fa-bookmark" aria-hidden="true"></i>
                    <span>NGワード管理</span>
                </NuxtLink>
            </li>
            
            <li  :class="{ active: page_data.sidebar == 'account'}">
                <NuxtLink to="/admin/account">
                    <i class="fas fa-lock" aria-hidden="true"></i>
                    <span>ログインID/PW 管理</span>
                </NuxtLink>
            </li>
        </ul>
    </aside>
    </b-sidebar>
</div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            isOpen: true
        }
    },
    props: {
        sidebar: String
    },
    methods: {
        checkActive(sidebar) {
            let isActive = sidebar===this.sidebar;
            return { active: isActive};
        },
        sidebarHide() {
            document.getElementById("main-content").style.paddingLeft = "20px";
            document.getElementById("main-sidebar-contant").style.display = "none";
            document.getElementById("main-navbar").style.left = "20px";
        },
        sidebarShow() {
            document.getElementById("main-content").style.paddingLeft = "270px";
            document.getElementById("main-sidebar-contant").style.display = "block";
            document.getElementById("main-navbar").style.left = "270px";
        }
    },
    computed: {
        page_data() {
            return this.$store.getters.getPageData;
        }
    },
})
</script>

<style lang="scss">

</style>
