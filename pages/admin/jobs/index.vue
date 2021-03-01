<template>
  <div>
    <b-alert variant="success" show v-if="$route.params.success == '1' && updated_success">表示(非表示）に変更しました</b-alert>
    <b-alert variant="success" show v-if="$route.params.success_remove == '1' || deleted_success">削除しました</b-alert>
    
    <b-container class="mt-2" fluid>
      
      <b-row class="mt-2">
        <!-- report input -->
        <b-col md="3" class="input-group-text no-border-radius-right">メンバー通報履歴</b-col>
        
        <b-col md="3" class="p-0 no-border-radius-left">
          <b-form-radio-group
              id="radio-group-report"
              class="mt-2 ml-2"
              v-model="reportSelected"
              :options="member_report"
              name="radio-report"
          ></b-form-radio-group>
        </b-col>
        <!-- end report input --> 
        
        <!-- status input -->
        <b-col md="3" class="input-group-text no-border-radius-right">メンバーステータス</b-col>
        
        <b-col md="3" class="p-0 no-border-radius-left">
          <b-form-radio-group
              id="radio-group-status"
              class="mt-2 ml-2"
              v-model="statusSelected"
              :options="member_status"
              name="radio-status"
          ></b-form-radio-group>
        </b-col>
        <!-- end status input -->
      </b-row>
      
      <b-row class="mt-2">
        <!-- date_start input -->
        <b-col md="3" class="input-group-text no-border-radius-right">登録日</b-col>
        
        <b-col md="3" class="p-0 no-border-radius-left">
          <b-form-datepicker v-model="dateStart" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option"> 　mm/dd/yyyy</b-form-datepicker>
        </b-col>
        <!-- end date_start input -->
        
        <b-col md="3" class="no-border-radius-right text-center">
          <i class="fas fa-arrow-right"></i>
        </b-col>
        
        <!-- date_end input -->
        <b-col md="3" class="p-0 no-border-radius-left">
          <b-form-datepicker v-model="dateEnd" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option">　mm/dd/yyyy</b-form-datepicker>
        </b-col>
        <!-- end date_end input -->
      </b-row>
      
      <b-row class="mt-2">
        <!-- recruiting_start input -->
        <b-col md="3" class="input-group-text no-border-radius-right">募集期間</b-col>
        
        <b-col md="3" class="p-0 no-border-radius-left">
          <b-form-datepicker v-model="recruitingStart" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option"> 　mm/dd/yyyy</b-form-datepicker>
        </b-col>
        <!-- end recruiting_start input -->
        
        <b-col md="3" class="p-0 no-border-radius-right text-center">
          <i class="fas fa-arrow-right"></i>
        </b-col>
        
        <!-- recruiting_end input -->
        <b-col md="3" class="p-0 no-border-radius-left">
          <b-form-datepicker v-model="recruitingEnd" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option"> 　mm/dd/yyyy</b-form-datepicker>
        </b-col>
        <!-- end recruiting_end input -->
      </b-row>
      
      <b-row class="mt-2">
        <!-- area input -->
        <b-col md="3" class="input-group-text no-border-radius-right">エリア</b-col>
      
        <b-col md="9" class="p-0 no-border-radius-left">
          <b-form-input class="no-border-radius-left" v-model="areaSearch" areaSearchholder=", , , 3か所まで"></b-form-input>
        </b-col>
        <!-- end area input -->
      </b-row>
      
      <b-row class="mt-2">
        <!-- keyword input -->
        <b-col md="3" class="input-group-text no-border-radius-right">フリーワード検索</b-col>
      
        <b-col md="9" class="p-0 no-border-radius-left">
          <b-form-input class="no-border-radius-left" v-model="textSearch" areaSearchholder="textextextext title username partial match"></b-form-input>
        </b-col>
        <!-- end keyword input -->
      </b-row>
      
      <b-row class="mt-2">
        <!-- skill input -->
        <b-col md="3" class="input-group-text no-border-radius-right">カテゴリ</b-col>
      
        <b-col md="9" class="p-0 no-border-radius-left">
          <b-form-checkbox-group class="mt-2 ml-2" id="skills-checkbox" v-model="skillListSelected" :options="skillList" name="flavour-1"></b-form-checkbox-group>
        </b-col>
        <!-- end skill input -->
      </b-row>

      <b-row class="mt-2 mb-2">
        <b-col md="2" class="p-0">
          <!-- Page limit -->
          <div>
            <b-dropdown text="表示件数切り替え" variant="outline-secondary">
              <b-dropdown-item v-on:click="changeSize(10)">10</b-dropdown-item>
              <b-dropdown-item v-on:click="changeSize(20)">20</b-dropdown-item>
              <b-dropdown-item v-on:click="changeSize(50)">50</b-dropdown-item>
              <b-dropdown-item v-on:click="changeSize(100)">100</b-dropdown-item>
            </b-dropdown>
          </div>
          <!-- End page limit -->
        </b-col>

        <b-col md="6 text-left" class="p-0">
          <b-button variant="outline-primary" v-on:click="searchJob">検索</b-button>
          <b-button variant="outline-success" v-on:click="resetPage">リセット</b-button>
        </b-col>
        
        <b-col md="4 text-left">
          <paginate v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination m-0'"> </paginate>
        </b-col>
      </b-row>
    </b-container>

    <div class="text-center" v-if="!loaded">
        <b-spinner variant="primary"></b-spinner>
    </div>

    <b-table
      responsive
      striped
      :fields="fields"
      :items="jobs"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      class="mt-2 table-bordered text-center"
    >
    
      <template #cell(created_at)="row">
        {{ formatDate(row.value) }}
      </template>

      <template #cell(recruiting_date)="row">
        {{ formatDate(row.item.recruiting_start) }} -  {{ formatDate(row.item.recruiting_end) }}
      </template>
      
      <template #cell(status)="row">
        {{ status_text(row.value) }}
      </template>
      
      <template #cell(get_skills)="row">
        {{ skill_text(row.value) }}
      </template>
      
      <template #cell(get_connect_areas)="row">
        {{ area_text(row.value) }}
      </template>
      
      <template #cell(get_user)="row">
        {{ row.value.username }}
      </template>
      
      <template #cell(get_reports)="row">
          {{ typeof row.value[0] == 'undefined' ? '' : formatDate(row.value[0].created_at) }}
      </template>
      
      <template #cell(detail)="row">
        <NuxtLink :to="{path:'/admin/jobs/detail', query:{job_id:row.item._id}}">
            <b-button variant="outline-success" class="mr-1">
            詳細
            </b-button>
        </NuxtLink>
      </template>

      <template #cell(delete)="row">
        <b-button variant="outline-danger" v-on:click="updateDeleteId(row.item._id)" v-b-modal.delete-model class="mr-1">
        削除
        </b-button>
      </template>

    </b-table>

    <div class="paginationBLock">
        <paginate v-model="pageCurrent" v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination pb-3'"> </paginate>
    </div>
    
    <b-modal id="delete-model" @ok="deleteJob" cancel-title="キャンセル">削除してもよろしいでしょうか。</b-modal>
  </div>
</template>


<script lang="ts">

  declare interface Area {
      _id: string,
      name: string
  }
  
  declare interface User {
      _id: string,
      username: string
  }
  
  declare interface Report {
      _id: string,
      content: string,
      reason: string,
      created_at: string
  }
  
  declare interface Skill {
      _id: string,
      created_at: string,
      name: string,
      status: string
  }
  
  declare interface Job {
      _id: string,
      created_at: string,
      recruiting_start: string,
      recruiting_end: string,
      title: string,
      status: string,
      get_skills: Array<Skill>,
      get_reports: Array<Report>,
      get_connect_areas: Array<Area>,
      get_user: Array<User>
  }

  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
  import adminMixin from "~/mixin/AdminMixin";
  import { PAGE_SIZE, DATETIME_JP } from "~/common/config";
  export default Vue.extend({
    data() {
      return {
        dateStart:'',
        dateEnd:'',
        recruitingStart:'',
        recruitingEnd:'',
        areaSearch:'',
        textSearch:'',
        reportSelected: "",
        statusSelected: "",
        jobs: [] as Job[],
        fields: [
          { key: 'created_at', label: '投稿年月日', sortable: true, class:"p-1"},
          { key: 'recruiting_date', label: '募集期間', sortable: true, class: 'text-center p-1' },
          {
            key: 'status',
            label: 'ステータス',
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true,
            class: "p-1"
          },
          { key: 'get_skills', label: 'カテゴリ',sortable: true, class:"p-1" },
          {key:'get_connect_areas',label:'エリア', class:"p-1"},
          {key:'get_user',label:'投稿者',sortable: true, class:"p-1"},
          {key:'title',label: '投稿タイトル',sortable: true, class:"p-1"},
          {key:'get_reports',label: '通報履歴',sortable: true, class:"p-1"},
          {key:'detail',label: '詳細', class:"p-1"},
          {key:'delete',label: '削除', class:"p-1"}
        ],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        skillListSelected: [],
        skillList: [] as any[],
        member_report: [
          { value: '1', text: 'あり' },
          { value: '0', text: 'なし' }
        ],
        member_status: [
          { value: '1', text: '有効' },
          { value: '0', text: '無効' },
          { value: '2', text: '退会' },

        ],
        renderPaginateComponent: true,
        pageCurrent: 1,
        numberPerPage: PAGE_SIZE,
        currentPage: 1,
        totalPage: 0,
        loaded: false,
        searchButtonStatus: false,
        deleteId: '',
        datetime_option: DATETIME_JP,
        orderName: '',
        orderType: false,
        updated_success: true,
        deleted_success: false
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
      
      rows():any {
        return ;
      }
    },
    
    mixins: [adminMixin],
    methods: {
        ...mapActions(['handleCrudAPIAdmin']),
        
        status_text(status:Number) {
            return status == 0 ? '非表示' : '表示';
        },
        
        skill_text(skills:Array<Skill>) {
          let nameArr = [];
          for(let skill of skills) {
            nameArr.push(skill.name);
          }
          return nameArr.join(", ");
        },
        
        area_text(areas:Array<Area>) {
          let nameArr = [];
          for(let area of areas) {
            nameArr.push(area.name);
          }
          return nameArr.join(", ");
        },
        
        searchJob() {
            this.pageCurrent = 1;
            this.currentPage = 1;
            this.searchButtonStatus = true;
            this.fetchDataWithPaginationOrCondition();
        },
        
        fetchDataWithPaginationOrCondition: function (deleteId = '') {
            let objCondition : any = {};
            if (this.searchButtonStatus == true) {
                // if (this.nameSearch !== "") 
                //     objCondition.nameSearch  = this.nameSearch; 
                if (this.areaSearch !== "") 
                    objCondition.areaSearch = this.areaSearch; 
                // if (this.departmentSelected !== "") 
                //     objCondition.departmentSelected = this.departmentSelected; 
                if (this.skillListSelected.length > 0) 
                    objCondition.skillListID = this.skillListSelected; 
                if (this.textSearch.length > 0) 
                    objCondition.text_search = this.textSearch; 
                if (this.dateStart.length > 0) 
                    objCondition.date_start = this.dateStart; 
                if (this.dateEnd.length > 0) 
                    objCondition.date_end = this.dateEnd;
                if (this.recruitingStart.length > 0) 
                    objCondition.recruiting_start = this.recruitingStart; 
                if (this.recruitingEnd.length > 0) 
                    objCondition.recruiting_end = this.recruitingEnd;
                if (this.statusSelected.length > 0) 
                    objCondition.statusSelected = this.statusSelected; 
                if (this.reportSelected !== "" && this.reportSelected !== "-1") 
                    objCondition.reportSelected = this.reportSelected; 
                if (deleteId !== '') 
                  objCondition.delete_id = deleteId; 
            }
            this.fetchData(objCondition);
        },
        
        async fetchData(objCondition: any = {}) {
            let user_id = this.$route.query.user_id;
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                objCondition.size = this.numberPerPage;
                objCondition.page = this.pageCurrent;
                if(typeof user_id != undefined)
                  objCondition.user_id = user_id;
                let objPagram = {
                    method: "post",
                    urlAPi: "job",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.jobs = dataResult.data.data;
                this.totalPage = dataResult.data.last_page;
                this.totalPage = dataResult.data.last_page;
                this.loaded = true;
                if(typeof objCondition.delete_id != 'undefined') {
                  this.updated_success = false;
                  this.deleted_success = true;
                }
            }
        },
        
        async fetchDataCate(objCondition: any = {}) {
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                objCondition.page = this.pageCurrent;
                let objPagram = {
                    method: "post",
                    urlAPi: "/listCategory",
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                let dataList: Skill[] = dataResult.data.data;
                if (dataResult.ok == true) {
                    dataList.forEach((item, key) => {
                        let objSkill: any = {
                            text: item.name,
                            value: item._id
                        }
                        this.skillList.push(objSkill);
                    });
                }
            }
        },
        
        async clickCallbackPagination(pageNumber: any) {
            this.pageCurrent = pageNumber;
            this.loaded = false;
            await this.fetchDataWithPaginationOrCondition();
        },
        
        skill_name: function(skills:Array<any>) {
            let listName = [];
            for(let skill of skills) {
                listName.push( skill.get_skill.name );
            }
            return listName.join(',  ');
        },
        
        resetPage() {
          this.reportSelected = "";
          this.statusSelected = "";
          this.areaSearch = "";
          this.textSearch = "";
          this.dateStart = "";
          this.dateEnd = "";
          this.recruitingStart = "";
          this.recruitingEnd = "";
          this.skillListSelected = [];
        },
        
        async changeSize(size:number) {
          this.numberPerPage = size;
          this.pageCurrent = 1;
          this.loaded = false;
          await this.fetchDataWithPaginationOrCondition();
        },
        
        updateDeleteId(id: string) {
          this.deleteId = id;
        },
        
        async deleteJob() {
          this.loaded = false;
          this.searchButtonStatus = true
          await this.fetchDataWithPaginationOrCondition(this.deleteId);
        }
    },
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
              {
                  text: "お仕事依頼管理",
                  to: "#"
              }
            ],
            title: "お仕事依頼リスト管理",
            sidebar: 'jobs'
        });
    },
    async fetch() {
      await this.fetchData();
      await this.fetchDataCate();
    }
  })
</script>
