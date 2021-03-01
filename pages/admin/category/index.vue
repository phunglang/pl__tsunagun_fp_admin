<template>
    <div>
        <b-alert variant="success" show v-if="$route.params.success == '1' && updated_success">スキル/資格が新規登録されました</b-alert>
        <b-alert variant="success" show v-if="$route.params.update_success == '1' && updated_success">スキル/資格を編集しました</b-alert>
        <b-alert variant="success" show v-if="$route.params.success_remove == '1' || deleted_success">削除しました</b-alert>
        <div class="text-center" v-if="!loaded">
          <b-spinner variant="primary"></b-spinner>
        </div>

        <b-container class="mt-2" fluid>
            <b-row class="mt-2">
                <b-col md="12" class="d-flex justify-content-around">
                    <b-button :to="{name:'admin-category-new'}" variant="outline-primary">新規追加</b-button>
                    <b-button v-on:click="updateStatus(1)" href="#" variant="outline-success">表示</b-button>
                    <b-button v-on:click="updateStatus(0)" href="#" variant="outline-warning">非表示</b-button>
                    <b-button variant="outline-danger" v-b-modal.delete-many-model>削除</b-button>
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
                        @change="check_all()"
                    >
                    </b-form-checkbox>
                </div>
              </template>

              <template #cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                  <i class="fa">&#xf046;</i>
                </template>

                <template v-else>
                  <i class="fa">&#xf096;</i>
                </template>
              </template>

              <template #cell(name)="row">
                  {{ row.value }}
              </template>

              <template #cell(status)="row">
                  {{ status_text(row.value) }}
              </template>

              <template #cell(edit)="row">
                  <NuxtLink :to="{name:'admin-category-detail-id', params:{id:row.item._id}}">
                      <b-button variant="outline-success" class="mr-1">
                      編集
                      </b-button>
                  </NuxtLink>
              </template>

              <template #cell(delete)="row">
                  <b-button variant="outline-danger" v-on:click="updateDeleteId(row.item._id)" class="mr-1" v-b-modal.delete-one-model>
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
      
      <b-modal id="delete-one-model" @ok="deleteItem" cancel-title="キャンセル">削除してもよろしいでしょうか。</b-modal>
      <b-modal id="delete-many-model" @ok="delSelected" cancel-title="キャンセル">{{deleteText}}</b-modal>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
declare interface Skill {
  _id: string,
  name: string,
  status: number,
  // skill: string,
  // skillValidate: string,
  // reportHistory: string,
}
import { mapActions, mapGetters } from 'vuex'
import { PAGE_SIZE } from "~/common/config";
export default Vue.extend({
    data() {
        return {
            loaded: false,
            chosseAll: 0,
            selected: [] as Skill[], // Must be an array reference!
            currentPage: 1,
            totalPage: 0,

            items: [] as Skill[],

            user_chossed: [] as number[],
            fields: [
                { key: 'selected', label: '全選択' },
                { key: 'name', label: 'スキル/資格', class: 'text-center' },
                { key: 'status', label: 'ステータス'},
                { key: 'edit', label: '編集' },
                { key: 'delete', label: '削除' }
            ],
          data : [],
          renderPaginateComponent: true,

          sortBy: '',
          sortDesc: false,
          sortDirection: 'asc',
          delete_id: '',
          updated_success: true,
          deleted_success: false
        };
    },
    layout: 'admin',

    computed: {
      ...mapGetters([
        'getTokens',
      ]),

      cate_selected () : Array<any>{
          let array_selected : any[] = [];
        for(let item of this.selected) {
          array_selected.push(item);
        }
        return array_selected;
      },

      rows():any {
          return this.items.length;
      },
      
      deleteText():string {
         if(this.cate_selected.length == 0) {
          return '削除の項目を選択してください。';
        }
        return '削除してもよろしいでしょうか。';
      }
    },
    methods: {
      ...mapActions(['handleCrudAPIAdmin']),

      onRowSelected(items:Array<Skill>) {
        this.selected = items
      },

      status_text(status:Number) {
          return status == 0 ? '非表示' : '表示';
      },

      check_all() {
          if(this.chosseAll == -1) {
            (this.$refs.selectableTable as any).selectAllRows();

          }
          else {
              (this.$refs.selectableTable as any).clearSelected();
          }
      },

      delSelected() {
        this.loaded=false;
        let arr_selected = this.cate_selected;
        let array_delete = [];

        for (let item of arr_selected) {
          array_delete.push(item._id);

        }
        let objCondition = {
          _id: array_delete
        };
        let objParam = {
          action: "delete",
          method: "post",
          urlAPi: "/category/delete",
          objCondition: objCondition,
        };
        this.handleCrudAPIAdmin(objParam).then(data => {
          if (data.ok == true)
            this.fetchData();
            this.updated_success = false;
            this.deleted_success = true;
        });
      },

      updateDeleteId(id:string) {
        this.delete_id = id;
      },
    
      deleteItem() {
        this.loaded=false;
          let array_delete = [] as string[];
          array_delete.push(this.delete_id);
          let objCondition = {
            _id:array_delete
          };
          let objParam = {
            action: "delete",
            method: "post",
            urlAPi: "/category/delete",
            objCondition:objCondition ,
          };
          this.handleCrudAPIAdmin(objParam).then(data => {
            if(data.ok == true) {
              this.fetchData()
              this.updated_success = false;
              this.deleted_success = true;
            }
        });

      },

      updateStatus(_status:number) {
        let arr=this.cate_selected;
        let array_ud = [];

        for(let item of arr) {
          if(item.status !== _status)
          array_ud.push(item._id);
        }
        let objCondition = {
          status:_status,
          _id: array_ud
        };

        let objParam = {
          action: "update",
          method: "post",
          urlAPi: "/category/setStatus",
          objCondition:objCondition ,
        };

        this.handleCrudAPIAdmin(objParam).then(data => {
          if(data.ok == true) {
            this.fetchData({update: true});
            let list_ids = [] as string[];
            for(let skill of this.selected) {
              list_ids.push(skill._id);
            }
            for(let item of this.items) {
              if(list_ids.indexOf(item._id) != -1) {
                item.status = _status;
              }
            }
          }
        });
      },
        
      async fetchData(objCondition: any = {}) {
        const accessToken = this.getTokens.accessToken;
        if (accessToken) {
          objCondition.size = PAGE_SIZE;
          objCondition.page = this.currentPage;
          let objPagram = {
            method: "post",
            urlAPi: "/listCategory",
            objCondition: objCondition
          };
          let dataResult = await this.handleCrudAPIAdmin(objPagram);
          this.loaded = true;
          if(objCondition.update)
            return;
          this.items = dataResult.data.data;
          this.totalPage = dataResult.data.last_page;
        }
      },

      async clickCallbackPagination(pageNumber: any) {
        this.currentPage = pageNumber;
        this.loaded = false;
        await this.fetchData();
      },
    },
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "スキル/資格マスタ",
                    to: "#"
                }
            ],
            title: "スキル/資格マスタ",
            sidebar: 'category'
        });
      // let objParam = {
      //   action: "list",
      //   method: "get",
      //   urlAPi: "/listCategory",
      //   objCondition: ""
      // };
      // if(this.data == null) {
      //   this.handleCrudAPIAdmin(objParam).then(data => {
      //     this.items = data.data;
      //   });
      // }
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
