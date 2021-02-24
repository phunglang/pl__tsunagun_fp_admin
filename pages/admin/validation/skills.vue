<template>
    <div>
        <div class="text-center" v-if="!loaded">
            <b-spinner variant="primary"></b-spinner>
        </div>

        <NuxtLink :to="{path: url_detail, query: {users: user_seleteced, page: 'skills'}}">
            <b-button variant="outline-success" class="mr-1" :disabled="user_seleteced.length == 0">
            詳細
            </b-button>
        </NuxtLink>

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
            <b-col md="10 text-left">
                <paginate v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination m-0 mr-3'"> </paginate>
            </b-col>
        </b-row>
        
        <!-- List user table -->
        <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="user_chossed"
            name="flavour-2"
        >

        <b-table
            responsive
            striped
            :items="this.data"
            :fields="fields"
            select-mode="multi"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            selectable
            ref="selectableTable"
            stacked="md"
            show-empty
            small
            class="mt-2 table-bordered text-center"
            @row-selected="onRowSelected"
            >
            
            <col
                v-for="field in fields"
                :key="field.key"
                :style="{ width: field.width }"
            >
    
            <template #head(selected)="data">
                 <div class="d-flex text-center justify-content-center">
                    {{ data.label }} 
                    <b-form-checkbox
                        :id="'checkbox-all'"
                        v-model="chosseAll"
                        name="checkbox-1"
                        class="ml-1"
                        value="-1"
                        unchecked-value="0"
                        @change="checkAll()"
                    >
                    </b-form-checkbox>
                </div>
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
            
            <template #cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                  <i class="fa">&#xf046;</i>
                </template>

                <template v-else>
                  <i class="fa">&#xf096;</i>
                </template>
            </template>
            
            <template #cell(created_at)="row">
                {{ formatDate(row.value) }}
            </template>

            <template #cell(get_certificates)="row">
                <p v-for="(skill, index) in skill_name(row.value)" :key="index">
                    {{skill}}
                </p>
            </template>
            
            <template #cell(status)="row">
                <p v-for="(skill, index) in row.item.get_certificates" :key="index">
                    {{ status_text(skill.status) }}
                </p>
            </template>

            <template #cell(_id)="row">
                <NuxtLink :to="{path: url_detail, query: {users: [row.value], page: 'skills'}}">
                    <b-button variant="outline-success" class="mr-1">
                    詳細
                    </b-button>
                </NuxtLink>
            </template>

            <template #row-details="row">
                <b-card>
                <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                </ul>
                </b-card>
            </template>
        </b-table>
        </b-form-checkbox-group>
        <!-- End List user table -->
        
        <div class="paginationBLock mb-3">
            <paginate v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination pb-3'"> </paginate>
        </div>
    
    </div>
</template>

<script lang="ts">

declare interface User {
    _id: string,
    created_at: string,
    username: string,
    status: string,
    get_certificates: Array<any>
}

declare interface Data {
    data: Array<any>,
}

import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
import { PAGE_SIZE } from "~/common/config";
export default Vue.extend({
    data() {
        return {
            url_detail : "/admin/validation/detail",
            total_rows : 0,
            loaded: false,
            chosseAll: [] as Number[],
            skill_selected: [],
            status_selected: [],
            report_selected: [],
            selected: [] as User[], // Must be an array reference!
            buttons: [
                { caption: 'Toggle 1', state: true },
                { caption: 'Toggle 2', state: false },
                { caption: 'Toggle 3', state: true },
                { caption: 'Toggle 4', state: false }
            ],
            skill_status: [
                { item: 'A', name: '認証待ちあり' },
                { item: 'B', name: '認証済' },
                { item: 'C', name: '未認証あり' }
            ],
            user_status: [
                { item: 'A', name: '有効' },
                { item: 'B', name: '無効' },
                { item: 'C', name: '退会' }
            ],
            user_report: [
                { item: 'A', name: 'あり' },
                { item: 'B', name: 'なし' }
            ],
            options: [
                { index: 0, value: null, text: 'Please select an option' },
                { index: 1, value: 'a', text: 'This is First option' },
                { index: 2, value: 'b', text: 'Selected Option' },
                { index: 3, value: { C: '3PO' }, text: 'This is an option with object value' },
                { index: 4, value: 'd', text: 'This one is disabled', disabled: true }
            ],
            user_chossed:  [] as number[],
            fields: [
                { key: 'selected', label: '全選択', class:'w-10'},
                { key: 'created_at', label: '提出日', class:'w-20'},
                { key: 'username', label: 'ユーザーネーム', class: 'text-center w-20'},
                { key: 'get_certificates', label: '認証待ち', class:'w-20' },
                { key: 'status', label: 'ステータス', class:'w-20'},
                { key: '_id', label: '確認', class:'w-10' }
            ],
            data : [] as User[],
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            renderPaginateComponent: true,
            pageCurrent: 1,
            currentPage: 1,
            totalPage: 0,
            orderName: '',
            orderType: false,
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
            perPage: PAGE_SIZE,
        };
    },
    layout: 'admin',
    mixins: [adminMixin],
    computed: {
        ...mapGetters([
            'getTokens',
        ]),
        
        user_seleteced () :Array<any> {
            let users = [];
            for(let item of this.selected) {
                users.push(item._id);
            }
            return users;
        },
    },
    methods: {
        ...mapActions(['handleCrudAPIAdmin']),
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
        
        onRowSelected(items:Array<User>) {
            var newItem = items.filter(x => !this.selected.includes(x));
            if(items.length > 5)
                this.removeLastSelection(newItem);
            else
                this.selected = items;
            this.chosseAll.pop();
        },
        
        removeLastSelection(items:Array<User>) {
            (this.$refs.selectableTable as any).unselectRow(this.data.indexOf(items[items.length - 1]));
        },
        
        async checkAll() {
            if(this.chosseAll.length > 0) {
                let count = 0;
                for(let item of this.selected)
                    this.removeLastSelection([item]);
                for(let index in this.data) {
                    let skill_validated = true;
                    for(let skill of this.data[index].get_certificates) {
                        if(skill.status == 0)
                            skill_validated = false;
                    }
                 
                    if(!skill_validated) {
                        await (this.$refs.selectableTable as any).selectRow(parseInt(index));
                        this.chosseAll.push(-1);
                        count++;
                        if(count == 5)
                            return
                    }
                }
            }
            else {
                (this.$refs.selectableTable as any).clearSelected();
            }
        },
        
        async fetchData(objCondition: any = {}) {
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                objCondition.size = this.perPage;
                objCondition.page = this.pageCurrent;
                if(this.orderName.length > 0) {
                    objCondition.orderName = this.orderName;
                    objCondition.orderType = this.orderType ? 'asc' : 'desc';
                }
                let objPagram = {
                    method: "post",
                    urlAPi: "validate-ids",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.data = dataResult.data.data;
                this.totalPage = dataResult.data.last_page;
                this.totalPage = dataResult.data.last_page;
                this.loaded = true;
            }
        },
        
        async clickCallbackPagination(pageNumber: any) {
            this.pageCurrent = pageNumber;
            this.loaded = false;
            await this.fetchData();
        },
        
        skill_name: function(skills:Array<any>) {
            let listName = [];
            for(let skill of skills) {
                listName.push( skill.get_skill.name );
            }
            return listName;
        },
        
        updateOrder(name: string) {
            if(this.orderName != name)
                this.orderType = false;
            this.orderName = name;
            this.orderType = !this.orderType;
            this.fetchData();
        },
        
        async onChangePagination() {
            this.perPage = this.paginationSelected;
            await this.fetchData();
        },
    },
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "スキル/資格を認証する",
                    to: "#"
                }
            ],
            title: "スキル/資格を認証する",
            sidebar: 'validation-skills'
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

    tr td:nth-child(3 + n) {
        width: 20%;
    }

    tr td:nth-child(1), tr td:nth-child(5) {
        width: 10%;
    }

    tr td:nth-child(2) {
        width: 40%;
    }
</style>
