<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" type="success" @click="submitForm">
          提交
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="panel-heading">编辑内容</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" style="margin-top: 20px;">
            <el-form-item v-if="!isEdit" label-width="120px" label="公司名称:" prop="customerId" class="postInfo-container-item">
              <el-select v-model="postForm.customerId" :remote-method="getRemoteCustomerList" filterable default-first-option remote placeholder="请输入公司名称" style="width: 92%">
                <el-option v-for="(item,index) in customerListOptions" :key="item+index" :label="item.CorporateName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item v-else label-width="120px" label="公司名称:" class="postInfo-container-item">
              <el-input v-model="postForm.CorporateName" :rows="1" type="text" class="article-input" disabled autosize placeholder="公司名称" style="width: 92%" />
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="跟单联系人:" prop="DocumentaryContact" class="postInfo-container-item">
                    <el-input v-model="postForm.DocumentaryContact" :rows="1" type="text" class="article-input" autosize placeholder="请输入跟单联系人" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="跟单方式:" prop="DocumentaryMode" class="postInfo-container-item">
                    <el-select v-model="postForm.DocumentaryMode" filterable default-first-option placeholder="请选择跟单方式">
                      <el-option v-for="(item,index) in documentaryModeListOptions" :key="item+index" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="跟单进度:" prop="DocumentaryProgress" class="postInfo-container-item">
                    <el-select v-model="postForm.DocumentaryProgress" filterable default-first-option placeholder="请输入跟单进度">
                      <el-option v-for="(item,index) in DocumentaryProgress" :key="item+index" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="下次联系:" prop="NextContact" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.NextContact"
                      type="datetime"
                      placeholder="选择日期时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="23">
                  <el-form-item label-width="120px" label="备注:">
                    <el-input v-model="postForm.remarks" :rows="4" type="textarea" class="article-textarea" placeholder="请输入备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </el-col>
        </el-row>

      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchDocumentary, saveDocumentary } from '@/api/documentary'
import { searchCustomer } from '@/api/remote-search';
import { generateUUID } from '@/utils';

const defaultForm = {
  status: 'draft',
  uuid: generateUUID(),
  userid: null,
  customerId: null,
  DocumentaryContact: null,
  DocumentaryMode: null,
  DocumentaryProgress: null,
  NextContact: null,
  remarks: undefined
}
const formLabel = {
  customerId: '公司名称',
  DocumentaryContact: '跟单联系人',
  DocumentaryMode: '跟单方式',
  DocumentaryProgress: '跟单进度',
  NextContact: '下次联系'
}

export default {
  name: 'CustomerDetail',
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '' || value === null) {
        this.$message({
          message: formLabel[rule.field] + '为必传项',
          type: 'error'
        })
        callback(new Error(formLabel[rule.field] + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      customerListOptions: [],
      rules: {
        customerId: [{ validator: validateRequire }],
        DocumentaryContact: [{ validator: validateRequire }],
        DocumentaryMode: [{ validator: validateRequire }],
        DocumentaryProgress: [{ validator: validateRequire }],
        NextContact: [{ validator: validateRequire }]
      },
      tempRoute: {},
      documentaryModeListOptions: [{
        value: '1',
        label: '电话沟通'
      }, {
        value: '2',
        label: '上门拜访'
      },
      {
        value: '3',
        label: '微信QQ沟通'
      }
      ],
      DocumentaryProgress: [
        {
          value: '1',
          label: '结束跟单'
        },
        {
          value: '2',
          label: '初次沟通'
        },
        {
          value: '3',
          label: '有意向'
        },
        {
          value: '4',
          label: '考虑中'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  created() {
    if (this.isEdit) {
      const uuid = this.$route.params && this.$route.params.uuid
      this.fetchData(uuid)
    }

    this.getUser();
  },
  methods: {
    getUser() {
      this.postForm.userid = this.userid;
    },
    fetchData(uuid) {
      fetchDocumentary(uuid).then(response => {
        this.postForm = response.data
        this.postForm.NextContact = this.postForm.NextContact * 1000;
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm);
      this.postForm.NextContact = new Date(this.postForm.NextContact).getTime() / 1000;
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveDocumentary(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            console.log(err);
          });
          this.postForm.status = 'published';
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteCustomerList(query) {
      searchCustomer(query).then(response => {
        if (!response.data.items) return;
        this.customerListOptions = response.data.items;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    margin: 40px 45px 20px 50px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 4px;
    .panel-heading{
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background: none;
      color: #333;
      border-color: #ddd;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      font-weight: bold;
    }
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 5px;
    border: 1px solid #bfcbd9;
  }
}
</style>
