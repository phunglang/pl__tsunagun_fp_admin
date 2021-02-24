<template>
    <div class="login-contain">
        <b-container class="mt-2" fluid>
            <b-row class="mt-2">
                <b-col md="12" class="d-flex justify-content-center">
                    <b-img fluid src="/admin/upload/logo.png" alt="Image 1"></b-img>
                </b-col>    
            </b-row>
            <b-row class="mt-2 d-flex justify-content-center">
                <b-col md="2" class="input-group-text no-border-radius-right">ID</b-col>
                <b-col md="10" class="p-0 no-border-radius-left"> 
                    <b-form-input class="no-border-radius-left" v-model="idUser"></b-form-input>
                </b-col>
            </b-row>
            
            <b-row class="mt-2 d-flex justify-content-center">
                <b-col md="2" class="input-group-text no-border-radius-right">PW</b-col>
                <b-col md="10" class="p-0 no-border-radius-left"> 
                    <b-form-input class="no-border-radius-left" type="password" v-model="password"></b-form-input>
                </b-col>
            </b-row>
            
            <b-row class="mt-2 d-flex justify-content-center">
                <b-button href="#" variant="outline-success" v-on:click="loginAdmin">ログイン</b-button>
            </b-row>
            
        </b-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined
export default Vue.extend({
    data() {
        return {
            fields: [
                {
                    key: 'age',
                    sortable: true
                },
                {
                    key: 'first_name',
                    sortable: true
                },
                {
                    key: 'last_name',
                    sortable: true,
                    // Variant applies to the whole column, including the header and footer
                }
            ],
            items: [
                { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                { age: 38, first_name: 'Jami', last_name: 'Carney' }
            ],
            idUser : "",
            password : "",

        }
    },
    layout: 'login',
    computed: {
        name() {
        let fullName: string = `Bob Bobbington`;
        let age: number = 37;
        let sentence: string = `Hello, my name is ${fullName}.I'll be ${age + 1} years old next month.`;
        return sentence;
        }
    },
    methods: {
        ...mapActions(['loginAdminAct','setUserCurrent']),
        loginAdmin: function() {
            let loginParams = {
                email :   this.idUser,
                password : this.password
            }
            this.loginAdminAct(loginParams).then(result => {
                if(result.ok === true){
                    let userToken : string =  result.data.access_token;
                    const auth = {
                             accessToken: userToken
                    }
                    this.$store.commit('SET_AUTH', auth);
                    Cookie.set('auth', auth)
                    this.$router.push({
                            name: 'admin-users',
                    });
                }else{
                    alert("アカウントが存在しないかパスワードが間違っています。");
                }
            });
        }
    },
})
</script>

<style scoped>
    .login-contain {
        width: 400px;
        margin: 200px auto;
    }
</style>