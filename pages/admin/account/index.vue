<template>
    <div>
        <b-container class="mt-2" fluid>
            
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">ログインID</b-col>
                <b-col md="8" class="p-0 no-border-radius-left"> 
                   <b-form-input class="no-border-radius-left" v-model="email" disabled></b-form-input>
                </b-col>
                <b-col md="1" class="p-0"> 
                    <NuxtLink to="/admin/account/detail">
                        <b-button variant="outline-success" class="h-100 w-100">編集</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
        </b-container>
     </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
export default Vue.extend({
    data() {
        return {
           email: ""
        };
    },
    layout: 'admin',
    mixins: [adminMixin],
    computed: {
        ...mapGetters([
            'getTokens',
        ]),
    },
    methods: {
        ...mapActions(['handleCrudAPIAdmin']),
        async fetchData(objCondition: any = {}) {
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                let objPagram = {
                    method: "get",
                    urlAPi: "/account",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.email = dataResult.data.email;
                // this.user_area = this.areaText(this.user.get_connect_areas);
                // this.loaded = true;
            }
        },
    },
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "ログインID/PW 管理",
                    to: "#"
                }
            ],
            title: "ログインID/PW 詳細",
            sidebar: 'account'
        });
    },
    async fetch() {
        await this.fetchData();
    }
})
</script>

<style lang="css" scoped>
    .input-group-text, th {
    width: 200px;
    }
    
    .search {
        width: initial;
    }
    
    .btn-group .btn {
        margin-right: 10px;
    }
</style>