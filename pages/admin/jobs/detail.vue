<template>
  <div>
    <b-container class="mt-2" fluid>

          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">投稿年月日</b-col>
  
            <b-col md="9" class="p-0 no-border-radius-left">
               <b-form-datepicker 
                id="example-datepicker" 
                v-model="data.created_at" 
                class="p-0 no-border-radius-left" disabled
                locale="ja" placeholder=""
                >
               </b-form-datepicker>
            </b-col>
          </b-row>
          
          <b-row class="mt-2">
            <!-- date_start input -->
            <b-col md="2" class="input-group-text no-border-radius-right">募集期間</b-col>
            
            <b-col md="4" class="p-0 no-border-radius-left">
              <b-form-datepicker 
                id="example-datepicker" 
                v-model="data.recruiting_start" 
                class="p-0 no-border-radius-left" 
                disabled
                locale="ja" placeholder=""
                >
              </b-form-datepicker>
            </b-col>
            <!-- end date_start input -->
            
            <b-col md="1" class="no-border-radius-right text-center">
              <i class="fas fa-arrow-right"></i>
            </b-col>
            
            <!-- date_end input -->
            <b-col md="4" class="p-0 no-border-radius-left">
              <b-form-datepicker 
                id="example-datepicker" 
                v-model="data.recruiting_end" 
                class="p-0 no-border-radius-left" 
                disabled
                locale="ja" placeholder=""
              >
              </b-form-datepicker>
            </b-col>
            <!-- end date_end input -->
          </b-row>

          <!-- Status input -->
          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">ステータス</b-col>
            <b-col md="9" class="p-0 no-border-radius-left border-form">
              <b-form-radio-group
                class="mt-2 ml-2"
                id="radio-group-1"
                v-model="data.status"
                :options="jobStatus"
                name="radio-options"
              ></b-form-radio-group>
            </b-col>
          </b-row>
          <!-- End Status input -->

          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">投稿者</b-col>
            <b-col md="9" class="no-border-radius-left input-group-text height-initial">
               {{userText(data.get_user)}}
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">カテゴリ</b-col>
            <b-col md="9" class="no-border-radius-left input-group-text height-initial">
              {{skillText(data.get_skills)}}
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">エリア</b-col>
            <b-col md="9" class="no-border-radius-left input-group-text height-initial">
              {{areaText(data.get_connect_areas)}}
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">タイトル</b-col>
            <b-col md="9" class="p-0 no-border-radius-left">
              <b-form-input
                v-model="data.title"
                readonly
                class="no-border-radius-left"
              ></b-form-input>
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">本文</b-col>
            <b-col md="9" class="p-0 no-border-radius-left">
              <b-form-input class="no-border-radius-left" readonly v-model="data.content"></b-form-input>
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col md="2" class="input-group-text no-border-radius-right">通報履歴</b-col>
            <b-col md="9" class="no-border-radius-left input-group-text height-initial">
              <p class="white-space-normal" v-for="report in data.get_reports" :key="report._id">
                <strong>{{formatDate(report.created_at)}}</strong> - {{report.reason}}
              </p>
            </b-col>
          </b-row>



      <!--  Job request -->
      <b-row class="mt-2 pb-3">
        <b-col md="6" class="text-left pl-0">
          <b-button href="#" variant="outline-success" class="btn-submit" v-on:click="update">更新</b-button>
          <b-button href="#" variant="outline-danger" v-b-modal.delete-model>削除</b-button>
        </b-col>
        <b-col md="5" class="text-right">
          <NuxtLink to="/admin/jobs">
            <b-button variant="outline-secondary">一覧へ戻る</b-button>
          </NuxtLink>
        </b-col>
      </b-row>
      <!-- End Job request -->
    </b-container>
    <b-modal id="delete-model" @ok="deleteJob">削除してもよろしいでしょうか。</b-modal>
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
      recruiting_date: string,
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
  export default Vue.extend({
    data() {
      return {
        value: '',
        jobStatus: [
          { text: '表示', value: '1' },
          { text: '非表示', value: '0' },
        ],
        title: '',
        text:'',
        data: {} as Job,
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
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
              {
                  text: "お仕事依頼管理",
                  to: "/admin/jobs"
              },
              {
                  text: "詳細",
                  to: "#"
              }
            ],
            title: "お仕事依頼リスト管理/詳細",
            sidebar: 'jobs'
        });
    },
    methods: {
      ...mapActions(['handleCrudAPIAdmin']),
        async fetchData(objCondition: any = {}) {
            let job_id = this.$route.query.job_id;
            const accessToken = this.getTokens.accessToken;
            if (accessToken) {
                let objPagram = {
                    method: "get",
                    urlAPi: "/job/" + job_id,
                    objCondition: objCondition
                };
                let dataResult = await this.handleCrudAPIAdmin(objPagram);
                this.data = dataResult.data;
                //console.log(this.data);
                // this.user = dataResult.data;
                // this.user_area = this.areaText(this.user.get_connect_areas);
                // this.loaded = true;
            }
        },
        
        skillText(skills:Array<Skill>) {
          if(typeof skills == 'undefined')
            return '';
          let nameArr = [];
          for(let skill of skills) {
            nameArr.push(skill.name);
          }
          return nameArr.join(", ");
        },
        
        areaText(areas:Array<Area>) {
          if(typeof areas == 'undefined')
            return '';
          let nameArr = [];
          for(let area of areas) {
            nameArr.push(area.name);
          }
          return nameArr.join(", ");
        },
        
        userText(user: User) {
          if(typeof user == 'undefined')
            return '';
          return user.username;
        },
        
        update() {
          let job_id = this.$route.query.job_id;
          let objCondition = {
            status: this.data.status,
          };
          let objParam = {
            action: "detail",
            method: "put",
            urlAPi: "/job/" + job_id,
            objCondition: objCondition
          };
          this.handleCrudAPIAdmin(objParam).then(data=>{
            if(data.ok == true)
              return this.$router.push({ name: 'admin-jobs', params:{success:"1"}});
          });
        },
        
        deleteJob() {
          let job_id = this.$route.query.job_id;
          let objParam = {
            action: "detail",
            method: "delete",
            urlAPi: "/job/" + job_id,
            objCondition: {}
          };
          this.handleCrudAPIAdmin(objParam).then(data=>{
            if(data.ok == true)
            return this.$router.push({ name: 'admin-jobs', params:{success_remove:"1"}});
          });
        }
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
