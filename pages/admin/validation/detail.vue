<template>
    <div>

        <div>
            <b-card no-body>
                <b-tabs pills card vertical>
                    <b-tab active v-for="user in users" :key="user.id" :title="user.username">
                        <b-container class="mt-2" fluid>
                            
                            <b-row class="mt-2">
                                <b-col md="12" class="text-center">
                                    <NuxtLink :to="{name:'admin-users-detail-id', query:{users:user._id}}">
                                        {{user.username}}
                                    </NuxtLink>
                                </b-col>
                            </b-row>
                            
                            <!-- ID Card validation -->
                            
                            <b-row class="mt-2" v-if="user.get_id_images != null">
                                <b-col md="12" class="input-group-text">身分証承認</b-col>
                            </b-row>
                            
                            <b-row class="mt-2" v-if="user.get_id_images != null">
                                <b-col md="10"> 
                                    
                                    <b-row>
                                        <b-col md="4" class="border-secondary">
                                
                                            <b-form-group v-slot="{ ariaDescribedby }">
                                                <b-form-radio-group
                                                    :id="'radio-validate-id-card-' + user._id"
                                                    v-model="user.ID_validate"
                                                    :options="options"
                                                    :aria-describedby="ariaDescribedby"
                                                    :name="'id-card-' + user._id"
                                                ></b-form-radio-group>
                                            </b-form-group>

                                            <b-img
                                                v-for="image in user.get_id_images" 
                                                :key="image._id" 
                                                thumbnail fluid 
                                                v-bind:src="mapAWS_URL(image.path)" 
                                                v-on:click="zoomImage(image.path)"
                                                alt="Image 1"
                                            ></b-img>
                                            
                                            <b-button href="#" variant="outline-secondary" v-on:click="idCardValidate(user._id, user.ID_validate)">更新</b-button>
                                        </b-col>        
                                    </b-row>
                                
                                </b-col>
                            </b-row>
                            <!-- End ID Card validation -->
                            
                            <b-row class="mt-2" v-if="user.get_id_images != null">
                                <b-col md="12" class="text-center">
                                    <NuxtLink :to="$route.query.page == 'id-card' ? '/admin/validation/id-card' : '/admin/validation/skills'">
                                        <b-button variant="outline-secondary">一覧に戻る</b-button>
                                    </NuxtLink>
                                </b-col>
                            </b-row>
                            
                            <!-- Skill validation -->
                            <b-row class="mt-4">
                                <b-col md="12" class="input-group-text">スキル/資格承認</b-col>
                            </b-row>
                            
                            <b-row class="mt-2">
                                <b-col md="10"> 
                                    
                                    <b-row>
                                        <b-col md="4" v-for="skill in user.get_certificates" :key="skill.id" class="border-secondary mt-4">
                                            <b-form-group v-slot="{ ariaDescribedby }">
                                                <b-form-radio-group
                                                    :id="'radio-validate-skill-' + skill._id"
                                                    v-model="skill.status"
                                                    :options="options"
                                                    :aria-describedby="ariaDescribedby"
                                                    :name="'skill-' + skill._id"
                                                ></b-form-radio-group>
                                            </b-form-group>

                                            <b-img 
                                                v-for="image in skill.get_images" 
                                                :key="image._id" 
                                                thumbnail fluid 
                                                v-bind:src="mapAWS_URL(image.path)" 
                                                alt="Image 1"
                                                v-on:click="$bvModal.show('bv-image-modal')"
                                            >
                                            </b-img>
                                            
                                            <b-button href="#" variant="outline-secondary" v-on:click="skillValidate(skill._id, skill.status)">更新</b-button>
                                        </b-col>        
                                    </b-row>
                                
                                </b-col>
                            </b-row>
                            <!-- End Skill validation -->
<!--                         
                            <b-row class="mt-2" v-if="user.get_id_images != null">
                                <b-col md="12" class="text-center">
                                    <NuxtLink to="/admin/validation/skills">
                                        <b-button variant="outline-secondary">一覧に戻る</b-button>
                                    </NuxtLink>
                                </b-col>
                            </b-row> -->
                        </b-container>          
                        
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
        <b-modal 
            id="bv-image-modal" 
            v-model="modalShow" 
            size="lg" 
            :hide-header="true"
            :hide-footer="true"
        >
            <b-img 
                class="w-100"
                thumbnail fluid 
                v-bind:src="mapAWS_URL(zoomImageSrc)" 
            ></b-img>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { AWS_URL } from "~/common/config";
export default Vue.extend({
    data() {
        return {
            remarks: '',
            value: '',
            selected: 0,
            options: [
                { text: '認証待ち', value: 0 },
                { text: '認証済', value: 1 },
                { text: '未認証', value: 2 },
            ],
            skills: [],
            birthday: '',
            users: [],
            image: 'https://picsum.photos/250/250/?image=54',
            data: [],
            loaded: false,
            zoomImageSrc: '',
            modalShow: false,
        };
    },
    layout: 'admin',
    computed: {
        ...mapGetters([
            'getTokens',
        ]),
        name() {
            let fullName: string = `Bob Bobbington`;
            let age: number = 37;
            let sentence: string = `Hello, my name is ${fullName}.I'll be ${age + 1} years old next month.`;
            return sentence;
        },
    },
    methods: {
        ...mapActions(['handleCrudAPIAdmin']),
        async fetchData(objCondition: any = {}) {
            let users = this.$route.query.users;
            const accessToken = this.getTokens.accessToken;
            objCondition.users = typeof users == "string" ? [users] : users;
            if (accessToken) {
                let objPagram = {
                    method: "post",
                    urlAPi: "validate/detail",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.users = dataResult.data;
                this.loaded = true;
            }
        },
        async updateStatus(objCondition: any = {}) {
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                let objPagram = {
                    method: "put",
                    urlAPi: "validate/detail",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.loaded = true;
            }
        },
        idCardValidate: function(id:String, status:Number) {
            let data = {
                _id : id,
                status : status,
                type : 0
            };
            this.loaded = false;
            this.updateStatus(data);
        },
        skillValidate: function(id:String, status:Number) {
            let data = {
                _id : id,
                status : status,
                type : 1
            };
            this.loaded = false;
            this.updateStatus(data);
        },
        zoomImage(path:string) {
            this.zoomImageSrc = path;
            this.modalShow = true;
        },
        
        mapAWS_URL: function(url: string) {
            return AWS_URL + url;
        },
    },
    created() {
        let page = this.$route.query.page || '';
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: page == 'id-card' ? "身分証を認証する" : "スキル/資格を認証する",
                    to: page == 'id-card' ? "/admin/validation/id-card" : "/admin/validation/skills"
                },
                {
                    text: "確認",
                    to: "#"
                }
            ],
            title: "認証依頼管理",
            sidebar: page == 'id-card' ? 'validation-id' : 'validation-skills'
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
    
    .card-img-top {
        height: 200px;
    }
    
    .btn-submit {
        width: 200px;
    }
</style>