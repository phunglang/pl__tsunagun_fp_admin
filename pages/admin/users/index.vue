<template>
<div>
    <b-container class="mt-2" fluid>
        <b-alert variant="success" show v-if="$route.params.success == '1'">正常に保存されました。</b-alert>
         
        <!-- Username input -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                ユーザーネーム
            </b-col>
            <b-col md="10" class="p-0 no-border-radius-left">
                <b-form-input class="no-border-radius-left" v-model="nameSearch"></b-form-input>
            </b-col>
        </b-row>
        <!-- End username input -->

        <!-- Area input -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                エリア
            </b-col>
            <b-col md="10" class="p-0 no-border-radius-left">
                <b-form-input class="no-border-radius-left" v-model="areaSearch" placeholder="カンマ区切り(,)で複数選択"></b-form-input>
            </b-col>
        </b-row>
        <!-- End area input -->

        <!-- Company input -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                所属
            </b-col>
            <b-col md="4">
                <b-form-select 
                    v-model="departmentSelected" 
                    :options="departmentSelectBox"
                ></b-form-select>
            </b-col>
        </b-row>
        <!-- End company input -->

        <!-- Skills List -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                スキル/資格
            </b-col>
            <b-col md="10" class="p-0 no-border-radius-left">
                <b-button-group size="sm" class="h-100 ml-2 mt-1">
                    <b-form-checkbox-group 
                        id="skills-checkbox" 
                        v-model="skillListSelected" 
                        :options="skillList" 
                        name="flavour-1"
                    ></b-form-checkbox-group>
                </b-button-group>
            </b-col>
        </b-row>
        <!-- End skills list -->

        <!-- Skill validation -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                スキル認証
            </b-col>
            <b-col md="10" class="p-0 no-border-radius-left">
                <b-form-checkbox-group 
                    v-model="skillStatusSelected" 
                    :options="skillStatus" 
                    class="mt-2 ml-2" 
                    value-field="item" 
                    text-field="name" 
                    disabled-field="notEnabled"
                ></b-form-checkbox-group>
            </b-col>
        </b-row>
        <!-- End skill validation -->

        <!-- Status checkboxs -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                ステータス
            </b-col>
            <b-col md="10" class="p-0 no-border-radius-left">
                <b-form-checkbox-group 
                    v-model="statusSelected" 
                    :options="userStatus" 
                    class="mt-2 ml-2" 
                    value-field="item" 
                    text-field="name" 
                    disabled-field="notEnabled"
                ></b-form-checkbox-group>
            </b-col>
        </b-row>
        <!-- End status checkboxs -->

        <!-- Report history checkbox -->
        <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">
                通報履歴
            </b-col>
            <b-col md="10" class="p-0 no-border-radius-left">
                <b-form-radio-group
                    id="radio-group-1"
                    class="mt-2 ml-2"
                    v-model="reportSelected"
                    :options="userReport"
                    name="radio-options"
                ></b-form-radio-group>
            </b-col>
        </b-row>
        <!-- End report history checkbox -->

        <b-row class="mt-2">
            <b-col md="2" style="p-1">
                <!-- Page limit -->
                <div class="wrapper mb-4">
                    <b-form-select 
                        v-model="paginationSelected" 
                        @change="onChangePagination" 
                        class="selectBoxTag bs__select--size" 
                        :options="paginationSelectBox"
                    ></b-form-select>
                </div>
                <!-- End page limit -->
            </b-col>
            <b-col md="6 text-left">
                <b-button variant="btn btn-primary" v-on:click="searchUser">検索</b-button>
                <b-button variant="btn btn-success" v-on:click="resetInput">リセット</b-button>
                <b-button variant="outline-success" v-on:click="exportCSV">CSVダウンロード</b-button>
            </b-col>

            <b-col md="4 text-left">
                <paginate v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination m-0'"> </paginate>
            </b-col>
        </b-row>
    </b-container>
    <!-- List user table -->
    <b-table 
        responsive 
        @row-selected="onRowSelected" 
        :bordered="bordered" 
        ref="selectableTable" 
        :select-mode="selectMode" 
        :items="listUser" 
        :fields="fields"
    >
    
        <template #head(stt)="data">
            {{ data.label }}
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('index')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(created_at)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('created_at')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(username)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('username')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(get_connect_areas)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('get_connect_areas')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(birthday)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('birthday')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(department)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('department')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(skill)="data">
            {{ data.label }} 
            <!-- <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('skill')">
                <i class="fas fa-sort"></i>
            </b-button> -->
        </template>
        
        <template #head(skillValidate)="data">
            {{ data.label }} 
            <!-- <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('skillValidate')">
                <i class="fas fa-sort"></i>
            </b-button> -->
        </template>

        <template #head(ID_validate)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('ID_validate')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(status)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('status')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(reportHistory)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('reportHistory')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
            
        <template #head(title)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('created_at')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #cell(stt)="row">
            <!-- {{row.index + 1 + (currentPage - 1) * perPage}} -->
            <p>
                {{row.item.index}}
            </p>
        </template>
        
        <template #cell(created_at)="row">
            {{formatDate(row.item.created_at)}}
        </template>
        
        <template #cell(skill)="row">
            <p v-for="(skill, index) in row.item.get_certificates" :key="index">
                {{ skill.get_skill.name }}
            </p>
            <!-- {{getUserSkillName(row.item.get_certificates)}} -->
        </template>
        
        <template #cell(skillValidate)="row" >
             <p v-for="(skill, index) in row.item.get_certificates" :key="index">
                {{ status_text(skill.status) }}
            </p>
             <!-- <span class="text-right" v-html="getUserSkillValidate(row.item.get_certificates)"></span> -->
        </template>
        
        <template #cell(ID_validate)="row">
            {{getUserImageIDValidate(row.item)}}
        </template>
        
        <template #cell(birthday)="row">
            {{getAge(row.item.birthday)}}
        </template>
        
        <template #cell(status)="row">
            {{getUserStatus(row.item)}}
        </template>
        
        <template #cell(get_connect_areas)="row">
            {{getArea(row.item)}}
        </template>
        
        
        <template #cell(department)="row">
            {{getDeparment(row.value)}}
        </template>
        
        <template #cell(reportHistory)="row">
            {{typeof row.item.get_user_reports[0] == 'undefined' ? 'なし' : 'あり'}}    
        </template>

        
      <template #cell(edit)="row">
            <NuxtLink :to="{name:'admin-users-detail-id', query:{users:row.item._id}}">
                <b-button variant="outline-success" class="mr-1">
                    詳細
                </b-button>
            </NuxtLink>
        </template>
    </b-table>
    <!-- End List user table -->
    <div class="paginationBLock">
        <paginate 
            v-if="renderPaginateComponent" 
            :page-count="totalPage" 
            :click-handler="clickCallbackPagination" 
            :prev-text="'<'" 
            :next-text="'>'" 
            :container-class="'pagination pb-3'"
        ></paginate>
    </div>
</div>
</template>

<script lang="ts">
import {
    mapActions,
    mapGetters,
} from "vuex"
import Vue from 'vue'
import adminMixin from "~/mixin/AdminMixin";
import mixins from 'vue-typed-mixins';
import { PAGE_SIZE, URL_API } from "~/common/config";
declare interface User {
    created_at: string,
    username: string,
    birthday: any,
    get_connect_areas:  Array < any >,
    department: string,
    status: string,
    ID_validate: string,
    get_certificates: Array < any > ,
}

declare interface Skill {
    _id: string,
    name: string,
}

const all = mixins(adminMixin);

export default Vue.extend({
    extends: all,
    data() {
        return {
            totalPage: 0,
            pageCurrent: 1,
            perPage: PAGE_SIZE,
            currentPage: 1,
            nameSearch: '',
            areaSearch: '',
            departmentSelected: -1,
            searchButtonStatus: false,
            skillStatusSelected: [],
            reportSelected: '',
            listUser: [] as User[],
            selected: [],
            bordered: true,
            selectMode: "multi",
            renderPaginateComponent: true,
            paginationSelected: 0,
            paginationSelectBox: [{
                    value: 0,
                    text: "表示件数切り替え",
                    disabled: true,
                },
                {
                    value: 20,
                    text: "20",
                },
                {
                    value: 50,
                    text: "50",
                },
                {
                    value: 100,
                    text: "100",
                }
            ],
            departmentSelectBox: [{
                    value: -1,
                    text: "表示件数切り替え",
                    disabled: true,
                },
                {
                    value: 0,
                    text: "保険会社専属",
                },
                {
                    value: 1,
                    text: "保険代理店",
                },
                {
                    value: 2,
                    text: "その他",
                },
            ],
            skillListSelected: [],
            skillList: [] as any[],
            skillStatus: [{
                    item: 0,
                    name: '認証待ちあり'
                },
                {
                    item: 1,
                    name: '認証済'
                },
                {
                    item: -1,
                    name: '未認証あり'
                }
            ],
            statusSelected: [],
            userStatus: [
                {
                    item:   1,
                    name: '有効'
                },
                {
                    item:   0,
                    name: '無効'
                },
                {
                    item:   2,
                    name: '退会'
                }
            ],
            userReport: [
                {
                    value: 1,
                    text: 'あり'
                },
                {
                    value:  0,
                    text: 'なし'
                }
            ],
            options: [{
                    index: 0,
                    value: null,
                    text: 'Please select an option'
                },
                {
                    index: 1,
                    value: 'a',
                    text: 'This is First option'
                },
                {
                    index: 2,
                    value: 'b',
                    text: 'Selected Option'
                },
                {
                    index: 3,
                    value: {
                        C: '3PO'
                    },
                    text: 'This is an option with object value'
                },
                {
                    index: 4,
                    value: 'd',
                    text: 'This one is disabled',
                    disabled: true
                }
            ],
            items: [

            ],
            fields: [
                {
                    key: 'stt',
                    label: 'ID',
                    class: 'text-center w-5 p-0',
                },
                {
                    key: 'created_at',
                    label: '登録年月日',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'username',
                    label: 'ユーザーネーム',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'get_connect_areas',
                    label: 'エリア',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'birthday',
                    label: '年齢',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'department',
                    label: '所属',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'skill',
                    label: 'スキル/資格',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'skillValidate',
                    label: 'スキル認証',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'ID_validate',
                    label: '身分証認証',
                    class: 'text-center w-10 p-0'
                },
                {
                    key: 'status',
                    label: 'ステータス',
                    class: 'text-center w-5 p-0'
                },
                {
                    key: 'reportHistory',
                    label: '通報履歴',
                    class: 'text-center w-5 p-0'
                },
                {
                    key: 'edit',
                    label: ''
                },
            ],
            orderName: '',
            orderType: false
        };
    },
    layout: 'admin',
    mixins: [adminMixin],
    
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "ユーザー管理",
                    to: "#"
                }
            ],
            title: "ユーザー管理一覧",
            sidebar: 'users'
        });
    },
    async fetch() {
        let objPagram = {
            method: "post",
            urlAPi: "listCategory",
        };
        let dataResult = await this.handleCrudAPIAdmin(objPagram);
        let dataList: Skill[] = dataResult.data.data;
        this.totalPage = dataResult.data.last_page;
        // this.listUser = [] as User[] ;
        if (dataResult.ok == true) {
            dataList.forEach((item, key) => {
                let objSkill: any = {
                    text: item.name,
                    value: item._id
                }
                this.skillList.push(objSkill);
            });
        }
        await this.fetchData();
    },
    computed: {
        ...mapGetters([
            'getTokens',
        ]),
        
        rows(): any {
            return this.items.length;
        },
    },
    methods: {
        ...mapActions(["handleCrudAPIAdmin"]),
        
        onChangePagination() {
            this.perPage = this.paginationSelected;
        },
        
        onRowSelected(items: any) {
            this.selected = items;
        },

        fetchDataWithPaginationOrCondition: function () {
            let objCondition : any = {};
            if (this.searchButtonStatus == true) {
                if (this.nameSearch !== "") 
                    objCondition.nameSearch  = this.nameSearch; 
                if (this.areaSearch !== "") 
                    objCondition.areaSearch = this.areaSearch; 
                if (this.departmentSelected !== -1) 
                    objCondition.departmentSelected = this.departmentSelected; 
                if (this.skillListSelected.length > 0) 
                    objCondition.skillListID = this.skillListSelected; 
                if (this.skillStatusSelected.length > 0) 
                    objCondition.skillStatusSelected = this.skillStatusSelected; 
                if (this.statusSelected.length > 0) 
                    objCondition.statusSelected = this.statusSelected; 
                if (this.reportSelected !== "" && this.reportSelected !== "-1") 
                    objCondition.reportSelected = this.reportSelected; 
                if (this.orderName.length > 0) {
                    objCondition.orderName = this.orderName;
                    objCondition.orderType = this.orderType ? 'asc' : 'desc';
                }
            }
            this.fetchData(objCondition);
        },
        
        searchUser() {
            this.searchButtonStatus = true;
            this.fetchDataWithPaginationOrCondition();
        },
        
        clickCallbackPagination(pageNumber: any) {
            this.pageCurrent = pageNumber;
            this.fetchDataWithPaginationOrCondition();
        },
        
        getUserSkillName(certificates: any[]): string {
            let nameSkill: string = '';
            certificates.forEach(function (item, key) {
                nameSkill += item.get_skill.name;
                if (key < certificates.length - 1) {
                    nameSkill += ' , ';
                }
            });
            return nameSkill;
        },
        
        getUserSkillValidate(certificates: any[]): string {
            let verifiedStatusText : string = '';
            let notVerifiedStatusText : string = '';
            let pendingStatusText : string = '';
            certificates.forEach(function (item, key) {
                let statusSkill: number = item.status;
                if (statusSkill == 1) 
                    verifiedStatusText += item.get_skill.name  + ' ';
                if (statusSkill == 0) 
                    pendingStatusText += item.get_skill.name  + ' ';
                if (statusSkill == -1) 
                    notVerifiedStatusText += item.get_skill.name  + ' ';
            });
            let textStatus = '';
            if(verifiedStatusText !== '')
                textStatus += '認証済: ' + verifiedStatusText;
            if(pendingStatusText !== '')
                textStatus += '認証待ち: ' + pendingStatusText;
            if(notVerifiedStatusText !== '')
                textStatus += '未認証: ' + notVerifiedStatusText;
            return textStatus;
        },
        
        getUserImageIDValidate(userItem: any): string {
            if (userItem.ID_validate == 1)
                return "認証済"
            if (userItem.ID_validate == 0)
                return "認証待ち";
            return "未認証";
        },
        
        getUserStatus(userItem: any): string {
            if (userItem.status == 1)
                return "有効"
            if (userItem.status == 0)
                return "無効";
            return "退会";
        },
        
        getArea(userItem: any): string {
            if (userItem.get_connect_areas == null)
                return ""
            let area_text = [];
            for(let area of userItem.get_connect_areas) {
                area_text.push(area.name);
            }
            //console.log(area_text);
           return area_text.join(", ");
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
        
        getAge(birthday:Date) {
            let now = new Date().getFullYear();
            let year = new Date(birthday).getFullYear();
            return now - year;
        },
        
        status_text(status:Number) {
            switch(status) {
                case 0:
                    return "認証待ち";
                case 1:
                    return "認証済";
                default:
                    return "未認証あり";
            }
        },
        
        async fetchData(objCondition: any = {}) {
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                objCondition.page = this.pageCurrent;
                objCondition.size = this.perPage;
                let objPagram = {
                    method: "post",
                    urlAPi: "user_management",
                    objCondition: objCondition,
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                let dataList: User[] = dataResult.data.data;
                this.totalPage = dataResult.data.last_page;
                this.listUser = [] as User[];
                if (dataResult.ok == true) {
                    this.listUser = dataList;
                }
            }

        },
        
        exportCSV() {
            const link = document.createElement('a');
            let url = URL_API+"/user_management/download?";
            let objCondition = [];
            if (this.nameSearch !== "") 
                objCondition.push("nameSearch=" + this.nameSearch); 
            if (this.areaSearch !== "") 
                objCondition.push("areaSearch=" + this.areaSearch); 
            if (this.departmentSelected !== -1) 
                objCondition.push("departmentSelected=" + this.departmentSelected); 
            if (this.skillListSelected.length > 0) 
                objCondition.push("skillListID=" + this.skillListSelected.join(","));
            if (this.skillStatusSelected.length > 0) 
                objCondition.push("skillStatusSelected=" + this.skillStatusSelected.join(","));
            if (this.statusSelected.length > 0) 
                objCondition.push("statusSelected=" + this.statusSelected.join(","));
            if (this.reportSelected !== "") 
                objCondition.push("reportSelected=" + this.reportSelected); 
             if (this.orderName.length > 0) {
                    objCondition.push("orderName=" + this.orderName); 
                    let type= this.orderType ? 'asc' : 'desc';
                    objCondition.push("orderType=" + type); 
                }
            link.setAttribute('href', url + objCondition.join('&'));
            link.setAttribute('download', 'user.xlsx');
            link.click();
        },
        
        updateOrder(name: string) {
            if(this.orderName != name)
                this.orderType = false;
            this.orderName = name;
            this.orderType = !this.orderType;
            this.searchButtonStatus = true;
            this.fetchDataWithPaginationOrCondition();
        },
        
        resetInput() {
            this.nameSearch = "";
            this.areaSearch = "";
            this.departmentSelected = -1;
            this.skillListSelected = [];
            this.skillStatusSelected = [];
            this.statusSelected = [];
            this.reportSelected = "";
            this.orderName = "";
        }
    },
})
</script>

<style lang="css" scoped>
.input-group-text,
th {
    width: 200px;
}

.search {
    width: initial;
}

.btn-group .btn {
    margin-right: 10px;
}
</style>
