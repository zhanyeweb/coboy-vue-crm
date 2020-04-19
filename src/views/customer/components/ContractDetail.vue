<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="panel-heading">合同内容</div>
          </el-col>
        </el-row>

        <div class="postInfo-container" style="margin-top: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="合同编号:" prop="ContractNumber" class="postInfo-container-item">
                <el-input v-model="postForm.ContractNumber" disabled :rows="1" type="text" class="article-input" autosize placeholder="请输入合同编号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="联系人:" prop="contact" class="postInfo-container-item">
                <el-input v-model="postForm.contact" :rows="1" type="text" class="article-input" autosize placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="开始日期:" prop="StartDate" class="postInfo-container-item">
                <el-date-picker
                  v-model="postForm.StartDate"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="120px" label="结束日期:" prop="EndDate" class="postInfo-container-item">
                <el-date-picker
                  v-model="postForm.EndDate"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="合同总金额:" prop="ContractAmount" class="postInfo-container-item">
                <el-input-number v-model="postForm.ContractAmount" :precision="2" :step="1" :max="999999999" placeholder="请输入合同总金额" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="120px" label="已收款:" prop="receivables" class="postInfo-container-item">
                <el-input-number v-model="postForm.receivables" :precision="2" :step="1" :max="999999999" placeholder="请输入已收款" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="欠款:" class="postInfo-container-item">
                <el-input-number v-model="postForm.arrears" :precision="2" :step="1" :max="999999999" placeholder="请输入欠款" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="审核:" class="postInfo-container-item">
                <el-input v-model="postForm.ToExamine" :rows="1" type="text" class="article-input" autosize placeholder="请输入审核" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="120px" label="操作员:" class="postInfo-container-item">
                <el-input v-model="postForm.operator" :rows="1" type="text" class="article-input" autosize placeholder="请输入操作员" />
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
        <div class="postInfo-container">
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="120px" label="附件:">
                <el-upload
                  class="upload-enclosures"
                  action=""
                  :show-file-list="false"
                  :limit="5"
                  :http-request="uploadEnclosures"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg,png,rar,doc,docx,xls,xlsx文件，且不超过2M，单次不能上传超过5个文件。</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="23">
            <el-form-item label-width="120px" label="">
              <el-table :data="postForm.enclosures" type="index" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="描述" fixed="left">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fileName }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="大小" width="100" fixed="left">
                  <template slot-scope="scope">
                    <span>{{ (scope.row.size/1024).toFixed(2) }} k</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="类型" width="100" fixed="left">
                  <template slot-scope="scope">
                    <span>{{ scope.row.file_extension }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="上传时间" width="150" fixed="left">
                  <template slot-scope="scope">
                    <span>{{ scope.row.inputtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="下载" width="100" fixed="left">
                  <template slot-scope="scope">
                    <i class="el-icon-download" style="cursor:pointer;" @click="downFile(scope.row.file,scope.row.fileName)" />
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="delEnclosures(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
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
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchContract, saveContract, uploadEnclosures } from '@/api/contract'
import { searchCustomer } from '@/api/remote-search'
import { generateUUID } from '@/utils';

const defaultForm = {
  status: 'draft',
  userid: null,
  uuid: null,
  customerId: null,
  contact: null,
  ContractNumber: null,
  StartDate: null,
  EndDate: null,
  ContractAmount: undefined,
  receivables: undefined,
  arrears: undefined,
  ToExamine: null,
  operator: null,
  remarks: null,
  enclosures: []
}
const formLabel = {
  customerId: '公司名称',
  contact: '联系人',
  ContractNumber: '合同编号',
  StartDate: '开始日期',
  EndDate: '结束日期',
  ContractAmount: '合同总金额',
  receivables: '已收款',
  arrears: '欠款',
  ToExamine: '审核',
  operator: '操作员',
  remarks: '备注'
}

export default {
  name: 'ContractDetail',
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: ''
    },
    customerUuid: {
      type: String,
      default: ''
    },
    handleHideDialog: {
      type: Function,
      default: null
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
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
        ContractNumber: [{ validator: validateRequire }],
        StartDate: [{ validator: validateRequire }],
        EndDate: [{ validator: validateRequire }],
        ContractAmount: [{ validator: validateRequire }],
        receivables: [{ validator: validateRequire }]
      },
      tempRoute: {}
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
    } else {
      this.postForm.uuid = generateUUID();
      this.postForm.ContractNumber = this.randomNumber();
    }

    this.getUser();
  },
  methods: {
    getUser() {
      this.postForm.userid = this.userid;
    },
    initPostForm() {
      this.postForm = Object.assign({}, defaultForm);
      this.postForm.uuid = generateUUID();
      this.postForm.ContractNumber = this.randomNumber();
      this.postForm.userid = this.userid;
    },
    fetchData(uuid) {
      fetchContract(uuid).then(response => {
        this.postForm = response.data;
        this.postForm.StartDate = this.postForm.StartDate * 1000;
        this.postForm.EndDate = this.postForm.EndDate * 1000;
        this.postForm.ContractAmount = this.postForm.ContractAmount / 100;
        this.postForm.receivables = this.postForm.receivables / 100;
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑合同'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.CorporateName}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑合同'
      document.title = `${title} - ${this.postForm.CorporateName}`
    },
    submitForm() {
      this.postForm.customerId = this.customerId;
      this.postForm.EndDate = new Date(this.postForm.EndDate).getTime() / 1000;
      this.postForm.StartDate = new Date(this.postForm.StartDate).getTime() / 1000;
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveContract(this.postForm).then(response => {
            this.$refs.postForm.uuid = generateUUID();
            this.$refs.postForm.resetFields();
            this.handleHideDialog();
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
    delEnclosures(index) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postForm.enclosures.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    uploadEnclosures(item) {
      const fileObj = item.file;
      // FormData 对象
      const form = new FormData();
      form.append('FILE_UPLOAD', fileObj);
      uploadEnclosures(form).then(response => {
        this.postForm.enclosures.unshift(response.data);
        console.log('response', response);
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
      }).catch(err => {
        console.log(err);
      });
    },
    downFile(url, filename) {
      // 创建隐藏的可下载链接
      const eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      eleLink.href = url;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    },
    // 根据当前时间和随机数生成流水号
    randomNumber() {
      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      return now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 89 + 100)).toString();
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
    padding-bottom: 20px;
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
