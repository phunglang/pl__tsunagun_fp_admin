<template>
    <div>

        <b-container class="mt-2" fluid>
          <b-alert show variant="danger" v-for="(error, index) in errors" :key="index">
            {{error[0]}}
          </b-alert>
            <!-- Date input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">投稿日 <span class="require-icon">※</span> </b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-datepicker 
                      id="example-datepicker" 
                      v-model="publish_date"
                      class="p-0 no-border-radius-left"
                      locale="ja" placeholder=""
                      v-bind="datetime_option"
                    ></b-form-datepicker>
                </b-col>
            </b-row>
            <!-- End Date input -->

            <!-- Title input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">タイトル <span class="require-icon">※</span> </b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-input class="no-border-radius-left" v-model="title" maxlength="40"></b-form-input>
                </b-col>
            </b-row>
            <!-- End Title input -->



            <!-- Content input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">内容 <span class="require-icon">※</span> </b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-textarea
                        id="textarea"
                        v-model="content"
                        rows="3"
                        max-rows="6"
                        maxlength="10000"
                    ></b-form-textarea>
                </b-col>
            </b-row>
            <!-- End Content input -->



              <!--  Buttons -->
            <b-row class="mt-2 pb-3">
                <b-col md="12" class="text-right pl-0">
                    <b-button v-on:click="update" variant="outline-success" class="btn-submit">投稿</b-button>
                    <NuxtLink to="/admin/admin-post">
                        <b-button class="btn-back" variant="outline-secondary">戻る</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
            <!-- End Buttons -->
        </b-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions,mapGetters } from 'vuex'
import adminMixin from "~/mixin/AdminMixin";
import { DATETIME_JP } from "~/common/config";
export default Vue.extend({
    data() {
        return {
          publish_date: '' ,
          content:'',
          title: '',
          errors:[],
          options: [
              { text: '表示', value: '1' },
              { text: '非表示', value: '0' },
          ],
          datetime_option: DATETIME_JP
        };
    },
  mixins: [adminMixin],

  layout: 'admin',

  computed: {
      ...mapGetters([
        'getTokens',
      ]),
    },

  methods: {
    ...mapActions(['handleCrudAPIAdmin']),
    update() {
      let objCondition = {
        publish_date: this.publish_date,
        title:this.title,
        content: this.content,
        _id: this.$route.params.id

      };
      let objParam = {
        action: "detail",
        method: "post",
        urlAPi: "/admin-post/update",
        objCondition: objCondition
      };
      this.handleCrudAPIAdmin(objParam).then(
        data=> {
          if(data.code == 422)
            this.errors = data.error;
          else
            return this.$router.push({ name: 'admin-admin-post', params:{update_success:"1"}});
        }
      );

    },
    formatDate(date:any, option = {} as any):string {
      let timeStr = "";
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      if (option.action === "fultime") {
        var hours = '' + d.getHours();
        var minute = '' + d.getMinutes();
        var second = '' + d.getSeconds();
        if (hours.length < 2) hours = '0' + hours;
        if (minute.length < 2) minute = '0' + minute;
        if (second.length < 2) second = '0' + second;
        return [year, month, day].join('-') + " " + [hours, minute,second].join(':');
      }

      return [year, month, day].join('-');
    },
    async fetchData(objCondition: any = {}) {
      const accessToken = this.getTokens.accessToken;
      if (accessToken) {
        let objPagram = {
          method: "get",
          urlAPi:"/admin-post/detail/"+this.$route.params.id,
          objCondition: objCondition
        };

        let dataResult  = await this.handleCrudAPIAdmin(objPagram);
        if (dataResult.data.publish_date.$date) {
          this.publish_date = dataResult.data.publish_date.$date ? dataResult.data.publish_date.$date.$numberLong : '' ;
          this.publish_date=this.formatDate(parseInt(this.publish_date));
        }

          this.title =dataResult.data.title;
          this.content =dataResult.data.content;
      }
    },
  },

  created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "運営からのお知らせ",
                    to: "/admin/admin-post"
                },
                {
                    text: "編集",
                    to: "#"
                }
            ],
            title: "運営からのお知らせ/編集",
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
