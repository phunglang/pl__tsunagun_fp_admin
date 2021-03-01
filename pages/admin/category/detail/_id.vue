<template>
    <div>
        <b-container class="mt-2" fluid>
          <b-alert show variant="danger" v-for="(error, index) in errors" :key="index">
            {{error[0]}}
          </b-alert>
            <!-- category name input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">スキル/資格</b-col>
                <b-col md="10" class="p-0 no-border-radius-left">
                    <b-form-input type="text"  maxlength="20" class="no-border-radius-left" v-model="name"></b-form-input>
                </b-col>
            </b-row>
            <!-- End Category name input -->

            <!-- Status input -->
            <b-row class="mt-2">
                <b-col md="2" class="input-group-text no-border-radius-right">ステータス</b-col>
                <b-col md="10" class="p-0 no-border-radius-left border-form">
                    <b-form-radio-group
                        class="mt-2 ml-2"
                        id="radio-group-1"
                        v-model="status"
                        :options="options"
                        name="radio-options"
                    ></b-form-radio-group>
                </b-col>
            </b-row>
            <!-- End Status input -->

              <!--  Buttons -->
            <b-row class="mt-2 pb-3">
                <b-col md="12" class="text-right pl-0">
                    <b-button variant="outline-success" class="btn-submit" v-b-modal.update-model>登録</b-button>
                    <NuxtLink to="/admin/category">
                        <b-button class="btn-back" variant="outline-secondary" >戻る</b-button>
                    </NuxtLink>
                </b-col>
            </b-row>
            <!-- End Buttons -->
        </b-container>
        
        <b-modal id="update-model" @ok="update" cancel-title="キャンセル">こちらの内容で登録いたします。</b-modal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
    data() {
        return {
            selected: '',
            name:'',
          status:'',
          errors: [],
          options: [
                { text: '表示', value: '1' },
                { text: '非表示', value: '0' },
            ],
        };
    },
    layout: 'admin',
  // async asyncData({ $axios , store }) {
  //   let access_token = store.getters.getTokens.accessToken;
  //   if(access_token){
  //     const name = await $axios.$get('category.detail',{ headers: {"Authorization" : `Bearer ${access_token}`} });
  //     return { name }
  //   }
  // },

  computed: {

    },
  methods: {
    ...mapActions(['handleCrudAPIAdmin']),

update() {
  let objCondition = {
    name:this.name,
    status: this.status,
    _id: this.$route.params.id
  };
  let objParam = {
    action: "detail",
    method: "post",
    urlAPi: "/category/update",
    objCondition: objCondition
  };
  this.handleCrudAPIAdmin(objParam).then(data=>{
    if(data.code == 422)
      this.errors = data.error;
    else
      // return this.$router.push({
      //   name:'admin-category'
      // })
      
      return this.$router.push({ name: 'admin-category', params:{update_success:"1"}});
      });

},
  },
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "スキル/資格マスタ",
                    to: "/admin/category"
                },
                {
                    text: "編集",
                    to: "#"
                }
            ],
            title: "スキル/資格編集",
            sidebar: 'category'
        });
      let objParam = {
        action: "detail",
        method: "get",
        urlAPi: "/category/detail/"+this.$route.params.id,
        objCondition: ""
      };
      if(this.name == null) {
        this.handleCrudAPIAdmin(objParam).then(data => {
          this.name = data.data.name;
          this.status = data.data.status;
        });
      }
    },
  async  fetch() {
     let objParam = {
       action: "detail",
       method: "get",
       urlAPi: "/category/detail/"+this.$route.params.id,
       objCondition: ""
     };
    // console.log();

    this.name = await this.handleCrudAPIAdmin(objParam).then( data => data.data.name);
    this.status=await this.handleCrudAPIAdmin(objParam).then( data => data.data.status);
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
