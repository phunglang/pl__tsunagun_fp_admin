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
          <b-form-datepicker id="example-datepicker" v-model="publish_date" class="p-0 no-border-radius-left" locale="ja" placeholder="" v-bind="datetime_option"></b-form-datepicker>
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
          <b-button href="#" v-on:click="newAdPost" variant="outline-success" class="btn-submit">登録</b-button>
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
  import { mapActions } from 'vuex'
  import { DATETIME_JP } from "~/common/config";
  export default Vue.extend({
    data() {
      return {
        publish_date: '',
        title:'',
        status: '1',
        errors:[],
        options: [
          { text: '表示', value: '1' },
          { text: '非表示', value: '0' },
        ],
        content : '',
        datetime_option: DATETIME_JP
      };
    },
    layout: 'admin',
    computed: {

    },
    methods: {
      ...mapActions(['handleCrudAPIAdmin']),
      newAdPost() {
        let objCondition = {
          publish_date: this.publish_date,
          title:this.title,
          content: this.content
        };
        console.log(objCondition);
        let objParam = {
          action: "detail",
          method: "post",
          urlAPi: "/admin-post/new",
          objCondition: objCondition
        };

        this.handleCrudAPIAdmin(objParam).then(data=>{
          if(data.code == 422)
            this.errors = data.error;
          else
            return this.$router.push({ name: 'admin-admin-post', params:{success:"1"}});
          });
      }
    },
    created() {
      this.$store.dispatch('setPageData', {
        bread_crumbs: [
          {
            text: "運営からのお知らせ 新規投稿",
            to: "#"
          },
          {
            text: "運営からのお知らせ",
            to: "/admin/admin-post"
          },
          {
            text: "詳細",
            to: "#"
          }
        ],
        title: "運営からのお知らせ/新規投稿",
        sidebar: 'admin-post'
      });
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
