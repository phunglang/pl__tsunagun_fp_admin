<template>
    <div>

        <b-container class="mt-2" fluid>
          <b-alert :show="dismissCountDown"
                   dismissible
                   :variant="alertvariant"
                   @dismissed="dismissCountDown=0"
                   @dismiss-count-down="countDownChanged"
          >
            {{messages}}
          </b-alert>



            <b-row class="mt-2">
                <b-col md="12" class="input-group-text">NGワード</b-col>

                <b-col md="12" class="p-0 mt-4">
                    <b-form-tags v-model="ngWords" no-outer-focus class="mb-2"
                      @tag-state="onTagState"
                    >
                        <template v-slot="{ tags, inputAttrs, inputHandlers, tagVariant}">
                            <b-input-group class="mb-2">
                            <b-form-input
                              v-model="inputTag"
                              v-bind="inputAttrs"
                              v-on="inputHandlers"
                              v-on:keyup.enter="addTag"
                              placeholder="New tag - Press enter to add"
                              class="form-control"
                            ></b-form-input>

                            <b-input-group-append>
                                <b-button @click="addTag()"  variant="primary">追加</b-button>

                            </b-input-group-append>

                            </b-input-group>
                            <div class="d-inline-block" style="font-size: 1.5rem;">
                              <b-form-invalid-feedback :state="validation">
                                Duplicate tags: {{duplicateTags}}
                              </b-form-invalid-feedback>
                              
                              <b-form-tag
                                  v-for="tag in tags"
                                  @remove="removeTag(tag)"
                                  :key="tag"
                                  :title="tag"
                                  :variant="tagVariant"
                                  class="mr-1"
                              >{{ tag }}</b-form-tag>
                            </div>
                        </template>
                    </b-form-tags>
                </b-col>


                <!--  Buttons -->
                <b-row class="mt-2 pb-3">
                    <b-col md="6" class="text-left">
                        <b-button href="#" variant="outline-success"
                                  v-on:click="add" class="btn-submit">更新</b-button>
                    </b-col>
                </b-row>
                <!-- End Buttons -->
            </b-row>
        </b-container>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
declare interface List {
  name : string,
}
export default Vue.extend({
    data() {
        return {
          duplicateTags: '',
          alertvariant:'',
          dismissSecs: 2,
          dismissCountDown: 0,
          validTags: [] as string[],
          invalidTags: [] as string[],
          ngWords:[] as string[],
          loaded:false,
          messages: '',
          removeTags: [] as string[],
          addTags: [] as string[],
          inputTag: ''
        };
    },
    layout: 'admin',
    computed: {
      ...mapGetters([
        'getTokens',
      ]),
      validation() {
        if (this.duplicateTags =='')
          return true
          else return false
          ;
      }
    },
    methods: {
      ...mapActions(['handleCrudAPIAdmin']),
      countDownChanged(dismissCountDown:any) {
        this.dismissCountDown = dismissCountDown
      },
      removeTag(tag:string) {
        let index = this.ngWords.indexOf(tag);
        if(index != -1) {
          this.ngWords.splice(index, 1);
          this.removeTags.push(tag);
        }
        let addIndex = this.addTags.indexOf(tag);
        if(addIndex != -1) {
          this.addTags.splice(addIndex, 1);
        }
      },
      addTag() {
        let tag = this.inputTag;
        let addIndex = this.addTags.indexOf(tag);
        if (addIndex == -1) {
        this.addTags.push(tag);
        this.inputTag = '';
          let removeIndex = this.removeTags.indexOf(tag);
          let index = this.ngWords.indexOf(tag);
          if(index == -1) {
            this.ngWords.push(tag);
          }
          if(removeIndex != -1) {
            this.removeTags.splice(removeIndex, 1);
          }
      }

      },
      onTagState(valid:string[], invalid:string[], duplicate:string) {
        this.validTags = valid,
        this.invalidTags = invalid,
        this.duplicateTags = duplicate
      },

      add() {
        console.log(this.removeTags);
        console.log(this.addTags);
      let objCondition = {
         tagAdd:this.addTags,
        tagRemove:this.removeTags

       };
         let objPagram = {
           method: "post",
           urlAPi: "/ng-word/update",
           objCondition: objCondition
         };
         this.handleCrudAPIAdmin(objPagram).then(data => {
           this.dismissCountDown = this.dismissSecs

           if(data.code == 422) {
             this.messages = data.error;
             this.alertvariant='danger';
           }
           else
           {
             this.alertvariant='success';
             this.messages=data.data.message;
             this.addTags =[];
             this.removeTags=[];
             this.fetchData();
           }
         });



      },
      async fetchData(objCondition: any = {}) {
        const accessToken = this.getTokens.accessToken;
        if (accessToken) {
          let objPagram = {
            method: "post",
            urlAPi: "/listNgWord",
            objCondition: objCondition
          };

          let dataResult=await this.handleCrudAPIAdmin(objPagram);
          console.log(dataResult);

          if (dataResult.ok == true) {

            dataResult.data.forEach((item: any) => {
              let name:string= item.name;
              this.ngWords.push(name);
            });

          }


        }
      },
    },
    created() {
        this.$store.dispatch('setPageData', {
            bread_crumbs: [
                {
                    text: "NGワード管理",
                    to: "#"
                }
            ],
            title: "NGワード管理",
            sidebar: 'ng-word'
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
