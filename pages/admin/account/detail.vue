<template>
    <div>
        <b-container class="mt-2" fluid>

            <b-alert show variant="danger" v-for="(error, index) in errors" :key="index">
                {{error[0]}}
            </b-alert>
            <!-- category name input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">ログインID</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-input class="no-border-radius-left" type="text" maxLength="30" v-model="email"></b-form-input>
                </b-col>
            </b-row>
            <!-- End Category name input -->

            <!-- Status input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">PW</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-input class="no-border-radius-left" type="password" maxLength="20" v-model="password"></b-form-input>
                </b-col>
            </b-row>
            <!-- End Status input -->

              <!--  Buttons -->
            <b-row class="mt-2 pb-3">
                <b-col md="12" class="text-right pl-0">
                    <b-button href="#" variant="outline-success" class="btn-submit" v-on:click="updateAccount">登録</b-button>
                    <NuxtLink to="/admin/account">
                        <b-button class="btn-back" variant="outline-secondary">戻る</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
            <!-- End Buttons -->
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
            id: '',
            email: '',
            password: '',
            errors: []
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
                this.id = dataResult.data._id;
                this.email = dataResult.data.email;
                // this.user_area = this.areaText(this.user.get_connect_areas);
                // this.loaded = true;
            }
        },
        async updateAccount(objCondition: any = {}) {
            const accessToken = this.getTokens.accessToken;
            objCondition._id = this.id;
            objCondition.email = this.email;
            objCondition.password = this.password;
            if (accessToken) {
                let objPagram = {
                    method: "put",
                    urlAPi: "/account",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                if(dataResult.code == 422)
                    this.errors = dataResult.error;
                else
                    this.$router.push({
                        path:'/admin'
                    })
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
                    to: "/admin/account"
                },
                {
                    text: "編集",
                    to: "#"
                }
            ],
            title: "ログインID/PW 編集",
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

    .btn-back {
        width: 150px;
    }

    .btn-group .btn {
        margin-right: 10px;
    }

    .card-img-top {
        height: 200px;
    }

    .btn-submit {
        width: 200px;
    }
</style>
