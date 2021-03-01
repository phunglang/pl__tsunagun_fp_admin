<template>
  <div>
    <b-alert variant="success" show v-if="$route.params.success == '1' && updated_success">表示(非表示）に変更しました</b-alert>
    <b-alert variant="success" show v-if="$route.params.success_remove == '1' || deleted_success">削除しました</b-alert>
    <div class="text-center" v-if="!loaded">
      <b-spinner variant="primary"></b-spinner>
    </div>

    <b-container class="mt-2" fluid>
      <b-row class="mt-2">
        <!-- Report history -->
        <b-col md="2" class="input-group-text no-border-radius-right">メンバー通報履歴</b-col>
        <b-col md="4" class="p-0 no-border-radius-left">
            <b-form-radio-group
              class="mt-2 ml-2"
              id="radio-group-1"
              v-model="reportStatusSelected"
              :options="reportStatus"
              name="report_status"
            ></b-form-radio-group>
        </b-col>
        <!-- End report history -->


        <!-- User status history -->
        <b-col md="2" class="input-group-text no-border-radius-right mt-2">メンバーステータス</b-col>
        <b-col md="3" class="pl-0 pt-1 no-border-radius-left">
            <b-form-checkbox-group
              class="mt-2 ml-2"
              id="radio-group-2"
              v-model="userStatusSelected"
              :options="user_status"
              name="user_status"
            ></b-form-checkbox-group>
        </b-col>
        <!-- End User status history -->
      </b-row>


      <!-- Date input -->
      <b-row class="mt-2">
        <b-col md="2" class="input-group-text no-border-radius-right">登録日　</b-col>
        <b-col md="4" class="p-0 no-border-radius-left">
            <b-form-datepicker id="date-start" v-model="date_start" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option"></b-form-datepicker>
        </b-col>

        <b-col md="2" class="no-border-radius-right text-center">
            <i class="fas fa-arrow-right"></i>
        </b-col>

        <b-col md="4" class="p-0 no-border-radius-left">
            <b-form-datepicker id="date-end" v-model="date_end" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option"></b-form-datepicker>
        </b-col>
      </b-row>
      <!-- End date input -->

      <!-- Post search input -->
      <b-row class="mt-2">
        <b-col md="2" class="input-group-text no-border-radius-right">投稿者検索</b-col>
        <b-col md="10" class="p-0 no-border-radius-left">
            <b-form-input v-model="textSearch" class="no-border-radius-left"></b-form-input>
        </b-col>
      </b-row>
      <!-- End Post search input -->


      <b-row class="mt-2">
        <b-col md="2">
          <!-- Page limit -->
          <div class="wrapper mb-4">
            <b-form-select v-model="paginationSelected" @change="onChangePagination" class="selectBoxTag bs__select--size" :options="paginationSelectBox"></b-form-select>
            <!-- <b-form-select v-model="paginationSelected" :options="paginationSelectBox"></b-form-select> -->
          </div>
          <!-- End page limit -->

        </b-col>

        <b-col md="6 text-left" >

          <b-button variant="btn btn-primary" v-on:click="searchUser">
              検索
            <strong class="text-primary">
              <i class="fas fa-search"></i>
            </strong>
          </b-button>
          <b-button variant="outline-success" v-on:click="reset">リセット</b-button>

        </b-col>
        
        <b-col md="4 text-left">
          <paginate v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination m-0'"> </paginate>
        </b-col>
      </b-row>
    </b-container>

    <!-- List user table -->
    <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="userChossed"
        name="flavour-2"
    >

      <b-table
          responsive
          striped
          :items="items"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          class="mt-2 table-bordered text-center"
      >
        <template #head(id)="">
          <b-form-checkbox
            :id="'checkbox-all'"
            v-model="chosseAll"
            name="checkbox-1"
            value="-1"
            unchecked-value="0"
            @change="check_all()"
          >
          </b-form-checkbox>
        </template>

        <template #head(created_at)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('created_at')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>

        <template #head(status)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('status')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #head(title)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('title')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
 
        <template #head(report_history)="data">
            {{ data.label }} 
            <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('report_count')">
                <i class="fas fa-sort"></i>
            </b-button>
        </template>
        
        <template #cell(created_at)="row">
          {{ formatDate(row.value) }}
        </template>

        <template #cell(status)="row">
            {{ statusText(row.value) }}
        </template>

        <template #cell(author)="row">
          {{ row.item.get_user.username }}
        </template>

        <template #cell(report_history)="row">
            {{ report_text(row.item.get_post_reports) }}
        </template>

        <template #cell(edit)="row">
          <NuxtLink :to="{name:'admin-user-post-detail-id', params:{id:row.item._id}}">
            <b-button variant="outline-success" class="mr-1">
            詳細
            </b-button>
          </NuxtLink>
        </template>

        <template #cell(delete)="row">
            <b-button variant="outline-danger" v-on:click="updateDeleteId(row.item._id)" class="mr-1" v-b-modal.delete-model>
            削除
            </b-button>
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

    <div class="paginationBLock">
      <paginate v-if="renderPaginateComponent" :page-count="totalPage" :click-handler="clickCallbackPagination" :prev-text="'<'" :next-text="'>'" :container-class="'pagination pb-3'"> </paginate>
    </div>
    
    <b-modal id="delete-model" @ok="deleteItem" cancel-title="キャンセル">削除してもよろしいでしょうか。</b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
declare interface User {
    created_at: string,
    username: string,
    birthday: any,
    get_connect_areas:  Array < any >,
    department: string,
    status: number,
    ID_validate: string,
    get_certificates: Array < any > ,
}

declare interface UserPost {
  title : string,
  created_at:string,
  status:number,
  author:string,
  report_history:number,
  area:string,
  get_user: User,
  _rowVariant: string
}
import { mapActions, mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
import { PAGE_SIZE, DATETIME_JP } from "~/common/config";
export default Vue.extend({
    data() {
        return {
          totalPage: 0,
          loaded: false,
          textSearch:'',
          chosseAll: 0,
          reportStatusSelected: [],
          reportStatus: [
              { text: 'あり', value: '1' },
              { text: 'なし', value: '0' },
          ],
          userStatusSelected: [],
          searchButtonStatus:false,
          user_status: [
              { text: '有効', value: '1' },
              { text: '無効', value: '0' },
              { text: '退会', value: '2' },
          ],
          perPage: PAGE_SIZE,
          datetime_option: DATETIME_JP,
          currentPage: 1,
          items: [] as UserPost[] ,
          userChossed: [],
          fields: [
              { key: 'created_at', label: '投稿年月日', class: 'text-center' },
              { key: 'status', label: 'ステータス'},
              { key: 'author', label: '投稿者'},
              { key: 'title', label: 'タイトル'},
              { key: 'report_history', label: '通報履歴'},
              { key: 'edit', label: '詳細' },
              { key: 'delete', label: '削除' }
          ],
          paginationSelected: null,
          paginationSelectBox: [
            {
              value: null,
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
            },

          ],
          renderPaginateComponent: true,

          sortBy: '',
          sortDesc: false,
          sortDirection: 'asc',
          date_start: '',
          date_end: '',
          orderName: '',
          orderType: false,
          deleteId: '',
          updated_success: true,
          deleted_success: false
        };
    },
    layout: 'admin',
  mixins: [adminMixin],

  computed: {
      ...mapGetters([
        'getTokens',
      ]),
        rows():any {
            return this.items.length;
        }
    },
    methods: {
      ...mapActions(['handleCrudAPIAdmin']),

      statusText(status:Number) {
          return status == 0 ? '非表示' : '表示';
      },

      report_text(status:any[]) {
                  return status.length == 0 ? 'なし' : 'あり';
      },

      updateDeleteId(id: string) {
        this.deleteId = id;  
      },
      
      deleteItem() {
        this.loaded = false;

          let objCondition = {
            _id: this.deleteId
          };
          let objParam = {
            action: "delete",
            method: "post",
            urlAPi: "/user-post/delete",
            objCondition: objCondition,
          };
          this.handleCrudAPIAdmin(objParam).then(data => {
            if (data.ok == true) {
              this.fetchData()
              this.updated_success = false;
              this.deleted_success = true;
            }
          });
      },

      onChangePagination() {
        if(this.paginationSelected == 20)
          this.perPage= 20;
        else if(this.paginationSelected == 50)
          this.perPage = 50;
        else if (this.paginationSelected == 100)
          this.perPage = 100;
          this.searchUser();
      },

      searchUser() {
        this.searchButtonStatus = true;
        this.fetchDataWithPaginationOrCondition();
      },

      reset() {
        this.searchButtonStatus = false;
        this.reportStatusSelected = [];
        this.userStatusSelected = [];
        this.date_start = '';
        this.date_end = '';
        this.textSearch = '';
        this.fetchData();
      },

      fetchDataWithPaginationOrCondition: function () {
        let objCondition : any = {};

        if (this.searchButtonStatus == true) {
          if (this.reportStatusSelected.length > 0)
            objCondition.report_status_selected  = this.reportStatusSelected;
          if (this.userStatusSelected.length > 0)
            objCondition.user_status_selected  = this.userStatusSelected;
          if(this.date_start !== '')
            objCondition.date_start  = this.date_start;
          if(this.date_end !== '')
            objCondition.date_end  = this.date_end;
          if(this.textSearch !== '')
            objCondition.text_search  = this.textSearch;
        }
        this.fetchData(objCondition);
      },

      async fetchData(objCondition: any = {}) {
        const accessToken = this.getTokens.accessToken;
        let user_id = this.$route.query.user_id;
        if (accessToken) {
          objCondition.size = this.perPage;
          objCondition.page = this.currentPage;
          if(typeof user_id != undefined)
              objCondition.user_id = user_id;
          
          if (this.orderName.length > 0) {
              objCondition.orderName = this.orderName;
              objCondition.orderType = this.orderType ? 'asc' : 'desc';
          }
          
          let objPagram = {
            method: "post",
            urlAPi: "/listUserPost",
            objCondition: objCondition
          };
          let dataResult = await this.handleCrudAPIAdmin(objPagram);
          this.items = Object.values(dataResult.data.data);
          for(let post of this.items) {
            if(post.get_user.status == 2) {
              post._rowVariant = 'danger'
            }
          }
          this.totalPage = dataResult.data.last_page;
          this.loaded = true;
        }
      },

      async clickCallbackPagination(pageNumber: any) {
        this.currentPage = pageNumber;
        this.loaded = false;
        await this.fetchData();
      },
      
      updateOrder(name: string) {
          if(this.orderName != name)
              this.orderType = false;
          this.orderName = name;
          this.orderType = !this.orderType;
          this.fetchData();
      },
    },

  created() {
      this.$store.dispatch('setPageData', {
          bread_crumbs: [
              {
                  text: "自由投稿管理",
                  to: "#"
              }
          ],
          title: "自由投稿管理",
          sidebar: 'user-post'
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

    .fa-arrow-right {
        line-height: 44px;
        font-size: 20px;
    }
</style>
