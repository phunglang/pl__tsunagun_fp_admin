<template>
    <div>
        <b-container class="mt-2" fluid>
            <div class="text-center" v-if="!loaded">
                <b-spinner variant="primary"></b-spinner>
            </div>
            <b-row>
                <b-col md="6">
                    
                    <!-- ID input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">ID</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                            <b-form-input class="no-border-radius-left" v-model="user.index" disabled></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End ID input -->

                    <!-- Created input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">登録年月日</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-datepicker id="example-datepicker" v-model="user.created_at" class="p-0 no-border-radius-left" disabled locale="ja" placeholder=""></b-form-datepicker>
                        </b-col>
                    </b-row>
                    <!-- End Created input -->

                    <!-- Status input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">ステータス</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                            <b-form-radio-group
                                class="mt-2 ml-2"
                                id="radio-group-1"
                                v-model="user.status"
                                :options="statusList"
                                name="radio-options"
                            ></b-form-radio-group>
                        </b-col>
                    </b-row>
                    <!-- End Status input -->

                    <!-- Username input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">ユーザーネーム</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-input class="no-border-radius-left" v-model="user.username" disabled></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End Username input -->

                    <!-- Password input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">パスワード</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-input class="no-border-radius-left" type="password" disabled>12345678</b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End Password input -->

                    <!-- department input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">所属</b-col>
                        <b-col md="8" class="no-border-radius-left input-group-text height-initial">
                            {{getDeparment(user.department)}}
                        </b-col>
                    </b-row>
                    <!-- End department input -->
                    
                    <!-- Skills input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">スキル/資格</b-col>
                        <b-col md="8" class="no-border-radius-left input-group-text height-initial">
                            <div class="ml-2" size="sm" 
                                v-for="(skill, index) in user.get_certificates" 
                                :key="skill._id" 
                                pill 
                                :variant="getSkillButton(skill.status)"
                            >
                                {{index != 0 ? ', ' : ''}}{{skill.get_skill.name}}
                                <i class="fas fa-check-square" v-if="skill.status == 1"></i>
                            </div>
                        </b-col>
                    </b-row>
                    <!-- End Skills input -->

                    <!-- Area input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">活動エリア</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-input class="no-border-radius-left" v-model="userArea" disabled></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End area input -->

                    <!-- Technique input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">得意分野</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-input class="no-border-radius-left" v-model="user.experience" disabled></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End Technique input -->


                    <!-- Jobs input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">経歴</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-input class="no-border-radius-left" v-model="user.career" disabled></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End Jobs input -->

                     <!-- Birthday input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">生年月日</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-datepicker 
                            id="example-datepicker" 
                            v-model="user.birthday" 
                            class="p-0 no-border-radius-left" 
                            disabled 
                            locale="ja" placeholder=""
                            ></b-form-datepicker>
                        </b-col>
                    </b-row>
                    <!-- End Birthday input -->

                    <!-- Comment input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">コメント</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">
                           <b-form-input class="no-border-radius-left" v-model="user.comment"></b-form-input>
                        </b-col>
                    </b-row>
                    <!-- End Comment input -->

                    <!-- Website input -->
                    <b-row class="mt-2">
                        <b-col md="4" class="input-group-text no-border-radius-right">ウェブサイト</b-col>
                        <b-col md="8" class="p-0 no-border-radius-left">    
                            <b-button class="ml-2" size="sm" 
                                v-for="website in user.websites" 
                                :key="website" 
                                pill variant="outline-primary"
                            >
                                <a :href="website" target="blank">{{website}}</a>
                            </b-button>
                        </b-col>
                    </b-row>
                    <!-- End Website input -->

                </b-col>

                <b-col md="6" class="p-0 pl-3 mt-2">
                    <!-- Avatar input -->
                    <div>
                        <b-input-group>
                            <template #prepend>
                            <b-input-group-text >プロフィール画像</b-input-group-text>
                            </template>
                            <b-img thumbnail fluid :src="user.avatar" alt="Image 1"></b-img>
                        </b-input-group>
                    </div>
                    <!-- End Avatar input -->
                </b-col>

            </b-row>

            <!-- Skill validation -->
            
            <!-- CMND input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">本人確認書類</b-col>
                <b-col md="8" class="p-3 no-border-radius-left">
                    <b-img class="mb-2" v-for="image in user.get_id_images" :key="image._id" thumbnail fluid v-bind:src="image.path" alt="Image 1"></b-img>
                        <b-form-group v-slot="{ ariaDescribedby }">
                            <b-form-radio-group
                                :id="'radio-validate-id-card-' + user._id"
                                v-model="user.ID_validate"
                                :options="validateStatusList"
                                :aria-describedby="ariaDescribedby"
                                :name="'id-card-' + user._id"
                            ></b-form-radio-group>
                        </b-form-group>

                    <b-button href="#" variant="outline-secondary" v-on:click="idCardValidate(user._id, user.ID_validate)">更新</b-button>
                </b-col>
            </b-row>
            <!-- End CMND input -->
                    
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">資格書類</b-col>
                <b-col md="10">

                    <b-row>
                        <b-col md="4" v-for="skill in user.get_certificates" :key="skill.id" class="border-secondary">
                            <b-img v-for="image in skill.get_images" :key="image._id" thumbnail fluid v-bind:src="image.path" alt="Image 1"></b-img>
                            <b-form-group v-slot="{ ariaDescribedby }">
                                <b-form-radio-group
                                    :id="'radio-validate-skill-' + skill._id"
                                    v-model="skill.status"
                                    :options="validateStatusList"
                                    :aria-describedby="ariaDescribedby"
                                    :name="'skill-' + skill._id"
                                ></b-form-radio-group>
                            </b-form-group>

                            <b-button href="#" variant="outline-secondary" v-on:click="skillValidate(skill._id, skill.status)">更新</b-button>
                        </b-col>        
                    </b-row>

                </b-col>
            </b-row>
            <!-- End Skill validation -->

            <!--  Free News -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">自由投稿</b-col>
                <b-col md="10">
                    <NuxtLink :to="{ path:'/admin/user-post', query:{ user_id : user._id } }">
                        <b-button variant="outline-secondary" style="width: 150px">自由投稿ページ</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
            <!-- End Free Skill -->


            <!--  Job request -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">お仕事依頼</b-col>
                <b-col md="10">
                    <NuxtLink :to="{ path:'/admin/jobs', query:{ user_id : user._id } }">
                        <b-button variant="outline-secondary" style="width: 150px">投稿ページ</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
            <!-- End Job request -->

            <!--  Remarks -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">備考</b-col>
                <b-col md="10">
                    <textarea maxlength="10000" v-model="user.note" rows="10" cols="50" class="form-control" style="resize: none; overflow-y: scroll; height: 150px;">
                    </textarea>
                </b-col>
            </b-row>
            <!-- End Remarks -->

            <!--  Report history -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">通報履歴</b-col>
                <b-col md="10">
                    <p v-for="report in user.get_user_reports" :key="report._id">{{formatDate(report.created_at)}} {{report.reason}}</p>
                </b-col>
            </b-row>
            <!-- End Report history -->


            <!--  Buttons -->
            <b-row class="mt-2 pb-3">
                <b-col md="6" class="text-left pl-0">
                    <b-button variant="outline-success" class="btn-submit" v-b-modal.update-model>更新</b-button>
                    <b-button href="#" variant="outline-danger" v-on:click="disableUser()" v-b-modal.update-model>アカウントを無効にする</b-button>
                </b-col>
                <b-col md="6" class="text-right">
                    <NuxtLink to="/admin/users">
                        <b-button variant="outline-secondary">一覧へ戻る</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
            <!-- End Buttons -->
        </b-container>
        <b-modal id="update-model" @ok="updateUser" cancel-title="キャンセル">こちらの内容で登録いたします。</b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
declare interface Skill {
    _id: string,
    name: string,
}
declare interface Certificate {
    skill_id: string,
    user_id: string,
    status : Number,
    images: Array<String>,
    get_skill: Skill,
}
declare interface User {
    created_at: string,
    username: string,
    age: string,
    area: string,
    department: string,
    status: number,
    ID_validate : string,
    get_certificates: Array<Certificate>,
    comment: string,
    note: string,
    get_connect_areas:  Array < any >
}
export default Vue.extend({
    data() {
        return {
            remarks: '',
            value: '',
            selected: 'first',
            statusList: [
                { text: '有効', value: 1 },
                { text: '無効', value: 0 },
                { text: '退会', value: 2 },
            ],
            validateStatusList: [
                { text: '認証待ち', value: 0 },
                { text: '認証済', value: 1 },
                { text: '未認証', value: 2 },
            ],
            skills: [],
            birthday: '',
            reports: [
                {id: 1, time:'2020/01/10', content: 'spam'},
                {id: 2, time:'2020/02/11', content: 'spam'},
                {id: 3, time:'2020/03/12', content: '***'},
                {id: 4, time:'2020/04/13', content: 'spam'},
                {id: 5, time:'2020/05/14', content: 'spam'},
                {id: 6, time:'2020/06/15', content: '***'},
            ],
            loaded: false,
            user: {} as User,
            userArea: ''
        };
    },
    layout: 'admin',
    mixins: [adminMixin],
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
                    method: "get",
                    urlAPi: "user_management/"+users,
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.user = dataResult.data;
                this.userArea = this.areaText(this.user.get_connect_areas);
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
        getSkillButton: function(type:Number) {
            switch (type) {
                case 0:
                    return "primary";
                case 1:
                    return "success";
                case 2:
                    return "danger";
            }
        },
        areaText(areas: Array<any>) {
            if(areas.length == 0) 
                return "";
            let area_text = [];
            for(let area of areas) {
                area_text.push(area.name);
            }
            return area_text.join(", ");
        },
        
        async disableUser() {
            this.user.status = 0;
        },
        
        async updateUser() {
            this.loaded = false;
            let users = this.$route.query.users;
            let objCondition = {
                comment : this.user.comment,
                status: this.user.status,
                note: this.user.note
            };
            let objPagram = {
                    method: "put",
                    urlAPi: "user_management/"+users,
                    objCondition: objCondition
            };
            let dataResult = await this.handleCrudAPIAdmin(objPagram);
            this.loaded = true;
            this.$router.push({ name: 'admin-users', params:{success:"1"}});
        },
        getDeparment(department: number) {
            switch(department) {
                case 0:
                    return '保険会社専属';
                case 1:
                    return '保険代理店';
                default:
                    return 'その他';
            }   
        },
    },
    created() {
        this.$store.dispatch('setPageData', {
             bread_crumbs: [
                {
                    text: "ユーザー管理",
                    to: "/admin/users"
                },
                {
                    text: "詳細",
                    to: "#"
                }
            ],
            title: "ユーザー管理 詳細",
            sidebar: 'users'
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
