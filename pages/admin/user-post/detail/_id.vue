<template>
    <div>
        <b-container class="mt-2" fluid>
            <b-alert show variant="danger" v-for="(error, index) in errors" :key="index">
              {{error[0]}}
            </b-alert>
            
            <!-- Date input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">投稿年月日</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-input  id="example-datepicker" v-model="post.created_at" class="no-border-radius-left" disabled locale="ja" placeholder=""></b-form-input >
                </b-col>
            </b-row>
            <!-- End Date input -->

            <!-- Status input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">ステータス</b-col>
                <b-col md="10" class="p-0 no-border-radius-left border-form">
                    <b-form-radio-group
                        class="mt-2 ml-2"
                        id="radio-group-1"
                        v-model="post.status"
                        :options="options"
                        name="radio-options"
                    ></b-form-radio-group>
                </b-col>
            </b-row>
            <!-- End Status input -->

            <!-- Author input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">投稿者</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-input class="no-border-radius-left" v-model="post.title" maxlength="40" disabled></b-form-input>
                </b-col>
            </b-row>
            <!-- End Author input -->

            <!-- Title input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">タイトル</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">

                    <b-form-input class="no-border-radius-left" v-model="username.username" maxlength="40" disabled></b-form-input>
                </b-col>
            </b-row>
            <!-- End Title input -->



            <!-- Content input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">本文</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-textarea
                        id="textarea"
                        v-model="post.content"
                        rows="3"
                        max-rows="6"
                        maxlength="10000"
                        disabled
                    ></b-form-textarea>
                </b-col>
            </b-row>
            <!-- End Content input -->

            <!-- List image -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">画像</b-col>
                <b-col md="10">
                    <b-row>
                        <b-col md="4" v-for="image in images" :key="image._id" class="border-secondary">
                            <b-card
                                :img-src="image.url"
                                img-alt="Image"
                                img-top
                                tag="article"
                                style="max-width: 20rem;"
                                class="mb-2"
                            >
                            </b-card>
                        </b-col>
                    </b-row>

                </b-col>
            </b-row>
            <!-- End List image -->

            <!-- Repost history -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">通報履歴</b-col>
                <b-col md="10" >
                  <p v-for="report in reportHistory" :key="report._id">{{formatDate(report.created_at)}} {{report.reason}}</p>
                </b-col>
            </b-row>
            <!-- End Repost history -->

            <!--  Buttons -->
            <b-row class="mt-2 pb-3">
                <b-col md="12" class="text-right pl-0">
                  <b-button href="#" v-on:click="update" variant="outline-success" class="btn-submit">更新</b-button>

        
                  <b-button variant="outline-danger" v-on:click="updateDeleteId(post._id)" class="mr-1" v-b-modal.delete-model>
                  削除
                  </b-button>
                </b-col>
            </b-row>
            <!-- End Buttons -->
            <b-row class="mt-2">
              <b-col md="12" class="d-flex justify-content-center">
                <NuxtLink to="/admin/user-post">
                    <b-button class="btn-back" variant="outline-secondary">一覧へ戻る</b-button>
                </NuxtLink>
              </b-col>
            </b-row>
        </b-container>
        
        <b-modal id="delete-model" @ok="deleteItem" cancel-title="キャンセル">削除してもよろしいでしょうか。</b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions,mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
declare interface UserPost {
  _id:string,
  created_at:string,
  title : string,
  status:number,
  content:string,
}
declare interface report {
  created_at :string
}
export default Vue.extend({
    data() {
        return {
          options: [
              { text: '表示', value: '1' },
              { text: '非表示', value: '0' },
          ],
          post:{} as UserPost,
          errors:[],
          reportHistory: [] as report[],
          images:[] as any,
          username:{} as any,
          deleteId: ''
        };
    },
    layout: 'admin',
    mixins: [adminMixin],

    computed: {
        ...mapGetters([
          'getTokens',
        ]),
    },

  methods: {
    ...mapActions(['handleCrudAPIAdmin']),
    update() {

      let objCondition = {
        status: this.post.status,
        _id: this.$route.params.id
      };
      let objParam = {
        action: "detail",
        method: "post",
        urlAPi: "/user-post/update",
        objCondition: objCondition
      };
      this.handleCrudAPIAdmin(objParam).then(data=>{
        if(data.code == 422)
          this.errors = data.error;
        else
          return this.$router.push({ name: 'admin-user-post', params:{success:"1"}});
      });

    },
    
    updateDeleteId(id: string) {
      this.deleteId = id;  
    },
    
    deleteItem() {
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
          if (data.ok == true)
            return this.$router.push({ name: 'admin-user-post', params:{success_remove:"1"}});
        });
    },

    async fetchData(objCondition: any = {}) {
      const accessToken = this.getTokens.accessToken;
      if (accessToken) {
        let objPagram = {
          method: "get",
          urlAPi:"/user-post/detail/"+this.$route.params.id,
          objCondition: objCondition
        };
        let dataResult  = await this.handleCrudAPIAdmin(objPagram)
        this.post = dataResult.data;
        this.username = dataResult.data.get_user;
        this.reportHistory = dataResult.data.get_post_reports;
        this.images = dataResult.data.get_files;
      }
    },
  },
  created() {
      this.$store.dispatch('setPageData', {
            bread_crumbs: [
              {
                text: "自由投稿管理 詳細",
                to: '#'
              },
              {
                  text: "自由投稿管理",
                  to: "/admin/user-post"
              },
              {
                  text: "詳細",
                  to: "#"
              }
          ],
          title: "自由投稿管理/詳細",
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

    .btn-back {
        width: 150px;
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
