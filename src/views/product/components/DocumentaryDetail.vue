<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="panel-heading">跟单内容</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" style="margin-top: 20px;">
            <el-form-item label-width="120px" label="公司名称:" class="postInfo-container-item">
              {{ CorporateName }}
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
              <el-row>
                <el-col :span="21">   .
                </el-col>
                <el-col :span="3">
                  <el-button v-loading="loading" type="success" @click="submitForm">
                    提交
                  </el-button>
                </el-col>
              </el-row>
            </div>

          </el-col>
        </el-row>

        <div class="record">
          <div class="salesRecord">跟单记录</div>

          <div v-for="(item,index) in listDocumentary" :key="index" class="recordDetail">
            <span class="avatar" style="height: 45px; width: 45px; line-height: 45px;">{{ item.FullName.slice(0,1) }}</span>
            <div style="margin-left: 60px; margin-top: -11px;">
              <span style="display: block; margin: 10px 0px; font-size: 14px; font-weight: bold; color: rgb(51, 51, 51);">{{ item.FullName }}</span>
              <el-dropdown class="more" trigger="click" @command="() => deleteDocumentary(item.uuid)">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div style="color: #909399;"><span style="font-size: 12px;">{{ item.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }} 通过 <span class="prominent">{{ formatterDocumentaryMode(item.DocumentaryMode) }}</span> 与 <span class="prominent">{{ item.CorporateName }}</span> 的 <span class="prominent">{{ item.DocumentaryContact }}</span> 进行了沟通</span></div>
              <pre class="convention" style="white-space: pre-wrap;">{{ item.remarks }}</pre>
              <div style="font-size: 12px;color: #909399;"><i class="el-icon-view" /> <span style="margin: 0px 5px;">目前进度：{{ formatterDocumentaryProgress(item.DocumentaryProgress) }}</span> &nbsp; <i class="el-icon-time" /><span style="margin: 0px 5px;">下次联系时间：{{ item.NextContact | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></div>
            </div>
          </div>
          <div style="text-align:center;"><pagination v-show="listDocumentaryTotal>0" :total="listDocumentaryTotal" :page.sync="listQuery.page" :limit.sync="listQuery.rows" :layout="'prev, pager, next'" :background="false" @pagination="fetchListByCustomerDocumentary" /></div>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import Pagination from '@/components/Pagination'
import { validURL } from '@/utils/validate'
import { fetchDocumentary, saveDocumentary, fetchListByCustomerDocumentary, deleteDocumentary } from '@/api/documentary'
import { fetchCustomer } from '@/api/customer';
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
  remarks: null
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
  components: { MDinput, Sticky, Pagination },
  props: {
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
      CorporateName: null,
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
      ],
      listQuery: {
        customerId: null,
        page: 1,
        rows: 20
      },
      listDocumentary: [],
      listDocumentaryTotal: 0
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  created() {
    const uuid = this.$route.params && this.$route.params.uuid;
    this.fetchData(uuid);
    this.getUser();
  },
  methods: {
    fetchListByCustomerDocumentary() {
      fetchListByCustomerDocumentary(this.listQuery).then(response => {
        this.listDocumentary = response.data.items;
        this.listDocumentaryTotal = response.data.total;
      }).catch(err => {
        console.log(err)
      })
    },
    getUser() {
      this.postForm.userid = this.userid;
    },
    fetchData(uuid) {
      fetchCustomer(uuid).then(response => {
        this.CorporateName = response.data.CorporateName;
        this.postForm.customerId = response.data.id;
        this.listQuery.customerId = response.data.id;
        this.fetchListByCustomerDocumentary();
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '跟单管理'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.CorporateName}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '跟单管理'
      document.title = `${title} - ${this.CorporateName}`
    },
    submitForm() {
      console.log(this.postForm);
      this.postForm.NextContact = new Date(this.postForm.NextContact).getTime() / 1000;
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveDocumentary(this.postForm).then(response => {
            this.$refs.postForm.resetFields();
            this.$refs.postForm.remarks = null;
            this.fetchListByCustomerDocumentary();
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.loading = false;
            this.postForm.uuid = generateUUID();
          }).catch(err => {
            this.loading = false;
            console.log(err);
          });
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
    },
    formatterDocumentaryMode(key) {
      switch (Number(key)) {
        case 1: {
          return '电话沟通';
        }
        case 2: {
          return '上门拜访';
        }
        case 3: {
          return '微信QQ沟通';
        }
      }
    },
    formatterDocumentaryProgress(key) {
      switch (Number(key)) {
        case 1: {
          return '结束跟单';
        }
        case 2: {
          return '初次沟通';
        }
        case 3: {
          return '有意向';
        }
        case 4: {
          return '考虑中';
        }
      }
    },
    deleteDocumentary(uuid) {
      deleteDocumentary(uuid).then(response => {
        this.fetchListByCustomerDocumentary();
        this.$message({
          message: '删除成功',
          type: 'success',
          showClose: true,
          duration: 1000
        });
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
    .record{
      padding-left: 30px;
      .salesRecord{
        width: 80px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #333;
        font-weight: bold;
        border-left: 3px solid #27b59c;
        margin-bottom: 20px;
      }
      .recordDetail{
        border-bottom: 1px solid #eee;
        padding: 20px;
        position: relative;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid #ccc;
          position: absolute;
          top: 20px;
          left: 20px;
          overflow: hidden;
          display: inline-block;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          text-align: center;
          color: #fff;
          background: #c0c4cc;
          line-height: 40px;
          font-size: 14px;
        }
        .more{
          position: absolute;
          right: 30px;
          top: 30px;
          font-size: 20px;
          border: none;
          margin: 20px 0;
          margin-left: 50%;
          -webkit-transform: translate(-50%);
          transform: translate(-50%);
          cursor: pointer;
        }
        .convention{
          font-size: 14px;
          margin-top: 20px;
          color: #000;
          margin-bottom: 20px;
        }
        .prominent{
          color: #27b59c;
        }
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
