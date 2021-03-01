<template>
    <div>
      <b-alert variant="success" show v-if="$route.params.success == '1' && updated_success">運営からのお知らせが新規登録されました</b-alert>
      <b-alert variant="success" show v-if="$route.params.update_success == '1' && updated_success">運営からのお知らせを編集しました</b-alert>
      <b-alert variant="success" show v-if="$route.params.success_remove == '1' || deleted_success">削除しました</b-alert>
      <div class="text-center" v-if="!loaded">
        <b-spinner variant="primary"></b-spinner>
      </div>

        <b-container class="mt-2" fluid>
            <b-row class="mt-2">
                <b-col md="12" class="">
                    <b-button :to="{name:'admin-admin-post-new'}" variant="outline-primary">新規投稿</b-button>
                </b-col>
            </b-row>
        </b-container>

        <!-- List user table -->
        <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="user_chossed"
            name="flavour-2"
        >

        <b-table
            responsive
            striped
            :items="items"
            :fields="fields"
            stacked="md"
            show-empty
            small
            class="mt-2 table-bordered text-center"
        >
          <template #head(publish_date)="data">
              {{ data.label }} 
              <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('publish_date')">
                  <i class="fas fa-sort"></i>
              </b-button>
          </template>
          
          <template #head(title)="data">
              {{ data.label }} 
              <b-button variant="outline-primary" size="sm" v-on:click="updateOrder('title')">
                  <i class="fas fa-sort"></i>
              </b-button>
          </template>
          
          <template #cell(publish_date)="row">
          {{row.value.$date ?  formatDate(parseInt(row.value.$date.$numberLong)):''}}
          </template>

          <template #cell(edit)="row">
            <NuxtLink :to="{name:'admin-admin-post-detail-id', params:{id:row.item._id}}">
                  <b-button variant="outline-success" class="mr-1">
                  編集
                  </b-button>
              </NuxtLink>
          </template>

          <template #cell(delete)="row">
              <b-button variant="outline-danger" v-on:click="updateDeleteId(row.item._id)"  class="mr-1" v-b-modal.delete-model>
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
declare interface Post {
  title : string,
  content:string,
  user_id:string,
  publish_date: Date
}
import { mapActions, mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
import { PAGE_SIZE } from "~/common/config";
export default Vue.extend({
    data() {
        return {
          loaded: false,

          chosse_all: 0,
          selected: [] as string[], // Must be an array reference!
          currentPage: 1,
          totalPage: 0,

          items:[] as Post[] ,
          user_chossed: [],
          fields: [
            { key: 'publish_date', label: '投稿年月日'},
            { key: 'title', label: 'タイトル'},
            { key: 'edit', label: '編集' },
            { key: 'delete', label: '削除' }
          ],
          renderPaginateComponent: true,
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
          urlAPi: "/admin-post/delete",
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

      async fetchData(objCondition: any = {}) {
        const accessToken = this.getTokens.accessToken;
        if (accessToken) {
          objCondition.size = PAGE_SIZE;
          objCondition.page = this.currentPage;
          
          if (this.orderName.length > 0) {
              objCondition.orderName = this.orderName;
              objCondition.orderType = this.orderType ? 'asc' : 'desc';
          }
          
          let objPagram = {
            method: "post",
            urlAPi: "/listAdminPost",
            objCondition: objCondition
          };
          let dataResult = await this.handleCrudAPIAdmin(objPagram);
          this.items = dataResult.data.data;
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
                    text: "運営からのお知らせ",
                    to: "#"
                }
            ],
            title: "運営からのお知らせ",
            sidebar: 'admin-post'
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
