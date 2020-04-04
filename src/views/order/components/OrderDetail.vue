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


            <div class="postInfo-container" style="margin-top: 20px;">
              <el-col :span="23">
                <el-form-item v-if="!isEdit" label-width="120px" label="客户名称:" prop="customerId" >
                  <el-select v-model="postForm.customerId" :remote-method="getRemoteCustomerList" filterable default-first-option remote placeholder="请输入公司名称" style="width: 100%;" >
                    <el-option v-for="(item,index) in customerListOptions" :key="item+index" :label="item.CorporateName" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item v-else label-width="120px" label="客户名称:" >
                  <el-input v-model="postForm.CorporateName" :rows="1" type="text" class="article-input" disabled autosize placeholder="公司名称" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="订单编号:" prop="OrderNumber" class="postInfo-container-item">
                    <el-input v-model="postForm.OrderNumber" disabled :rows="1" type="text" class="article-input disabled-input" autosize placeholder="请输入订单编号" />
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
                  <el-form-item label-width="120px" label="下单日期:" prop="OrderDate" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.OrderDate"
                      type="date"
                      value-format="timestamp"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="交单日期:" prop="PresentationDate" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.PresentationDate"
                      type="date"
                      value-format="timestamp"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="订单总金额:" prop="OrderAmount" class="postInfo-container-item">
                    <el-input-number v-model="postForm.OrderAmount" disabled :precision="2" :step="1" :max="999999999" placeholder="请输入订单总金额"></el-input-number>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="已收款:" prop="receivables" class="postInfo-container-item">
                    <el-input-number v-model="postForm.receivables" :precision="2" :step="1" :max="999999999" placeholder="请输入已收款"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="欠款:" class="postInfo-container-item">
                    <el-input-number v-model="postForm.arrears" disabled :precision="2" :step="1" :max="999999999" placeholder="请输入欠款"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="收货人:" class="postInfo-container-item">
                    <el-input v-model="postForm.consignee" :rows="1" type="text" class="article-input" autosize placeholder="请输入收货人" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="收货人电话:" class="postInfo-container-item">
                    <el-input v-model="postForm.ConsigneeTelephone" :rows="1" type="text" class="article-input" autosize placeholder="请输入收货人电话" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="23">
                  <el-form-item label-width="120px" label="收货人地址:" >
                    <el-input v-model="postForm.ConsigneeAddress" :rows="1" type="text" class="article-input" placeholder="请输入收货人地址" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="23">
                  <el-form-item label-width="120px" label="备注:" >
                    <el-input v-model="postForm.remarks" :rows="4" type="textarea" class="article-textarea" placeholder="请输入备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="120px" label="附件:" >
                    <el-upload
                      class="upload-enclosures"
                      action=""
                      :show-file-list=false
                      :limit="5"
                      :http-request="uploadEnclosures">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg,png,rar,doc,docx,xls,xlsx文件，且不超过2M，单次不能上传超过5个文件。</div>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
              <el-row>
                <el-col :span="23">
                  <el-form-item label-width="120px" label="" >
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
                          <i class="el-icon-download" @click="downFile(scope.row.file,scope.row.fileName)" style="cursor:pointer;"/>
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
              <div class="postInfo-container product">
                <el-row>
                  <el-col :span="23">
                    <el-form-item label-width="120px" label="商品明细:" >
                      <div class="leabel-box">
                        <div class="priceInfo">成本总合：<span>{{costPrice}}元</span> 售价总合：<span>{{sellingPrice}}元</span> 数量总合：<span>{{productNumber}}</span> 折扣总合：<span>{{discount}}元</span> 最终总金额：<span>{{totalSum}}元</span></div>
                        <el-button size="small" class="el-button--small selectProductBtn" type="success" @click="showProductDialog">
                          选择商品
                        </el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-row>
                <el-col :span="23">
                  <el-form-item label-width="120px" label="" >
                    <el-table :data="postForm.productList" type="index" border fit highlight-current-row style="width: 100%">
                      <el-table-column align="center" label="序号" type="index" width="100" fixed="left">

                      </el-table-column>
                      <el-table-column align="center" label="商品名称" width="200" fixed="left">
                        <template slot-scope="scope">
                          <span>{{ scope.row.productName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="成本价" width="150" >
                        <template slot-scope="scope">
                          <span>{{ (scope.row.costPrice)}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="售价" width="150" >
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.sellingPrice" size="small" :max="9999999" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="数量" width="150" >
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.num" size="small" :min="1" :max="9999" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="折扣" width="150" >
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.discount" size="small" :max="999999999" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="商品总金额" width="150" >
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.totalSum" size="small" :max="999999999" placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="备注" width="150" >
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.info" :rows="1" size="small" type="text" class="article-input" autosize placeholder="" />
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="录入时间" width="100" >
                        <template slot-scope="scope">
                          <span>{{ scope.row.inputtime | parseTime('{y}-{m}-{d}') }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" icon="el-icon-delete" @click="delProductList(scope.$index)">
                              删除
                            </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
      </div>
    </el-form>
    <el-dialog width="1000px" :visible.sync="productDialogVisible" :title="'选择产品'">
        <product-dialog :onCheckProduct="onCheckProduct" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import ProductDialog from './ProductDialog'
import { validURL } from '@/utils/validate'
import { fetchOrder, saveOrder, uploadEnclosures } from '@/api/order'
import { searchCustomer } from '@/api/remote-search'
import { generateUUID } from '@/utils';

const defaultForm = {
  status: 'draft',
  userid: null,
  uuid: null,
  customerId: null,
  contact: null,
  OrderNumber: null,
  OrderDate: null,
  PresentationDate: null,
  OrderAmount: undefined,
  receivables: undefined,
  arrears: undefined,
  consignee: undefined,
  ConsigneeTelephone: null,
  ConsigneeAddress: null,
  remarks: null,
  enclosures: [],
  productList: [],
  delProduct: [],
}
const formLabel = {
  customerId: '客户名称',
  contact: '联系人',
  OrderNumber: '订单编号',
  OrderDate: '开始日期',
  PresentationDate: '结束日期',
  OrderAmount: '合同总金额',
  receivables: '已收款',
  arrears: '欠款',
  consignee: '收货人',
  ConsigneeTelephone: '收货人电话',
  ConsigneeAddress: '收货人地址',
  remarks: '备注'
}

export default {
  name: 'ContractDetail',
  components: { MDinput, Sticky, ProductDialog },
  props: {
    isEdit: {
      type: Boolean,
      default: false
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
      tempRoute: {},
      productDialogVisible: false
    }
  },
  watch: {
    postForm:{
      handler: function (newVal, oldVal){
        newVal.productList && newVal.productList.map((v, k) => {
          newVal.productList[k].totalSum = v.sellingPrice * v.num - v.discount;
        });
        newVal.OrderAmount = newVal.productList && newVal.productList.reduce((prev, cur, index) => {
          return cur.sellingPrice * cur.num - cur.discount + prev;
        }, 0);
        newVal.arrears = newVal.OrderAmount - newVal.receivables;
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
      'name',
      'userid'
    ]),
    costPrice: function(){
      return this.postForm.productList && this.postForm.productList.reduce((prev, cur, index) => {
        return cur.costPrice * cur.num + prev;
      }, 0);
    },
    sellingPrice: function(){
      return this.postForm.productList && this.postForm.productList.reduce((prev, cur, index) => {
        return cur.sellingPrice * cur.num + prev;
      }, 0);
    },
    productNumber: function(){
      return this.postForm.productList && this.postForm.productList.reduce((prev, cur, index) => {
        return cur.num + prev;
      }, 0);
    },
    discount: function(){
      return this.postForm.productList && this.postForm.productList.reduce((prev, cur, index) => {
        return cur.discount + prev;
      }, 0);
    },
    totalSum: function(){
      return this.postForm.productList && this.postForm.productList.reduce((prev, cur, index) => {
        return cur.sellingPrice * cur.num - cur.discount + prev;
      }, 0);
    },
  },
  created() {
    if (this.isEdit) {
      const uuid = this.$route.params && this.$route.params.uuid
      this.fetchData(uuid)
    }else{
      this.postForm.uuid = generateUUID();
      this.postForm.OrderNumber = this.randomNumber();
    }
    this.getUser();
  },
  methods: {
    getUser() {
      this.postForm.userid = this.userid;
    },
    fetchData(uuid) {
      fetchOrder(uuid).then(response => {
        this.postForm = {...this.postForm, ...response.data};
        this.postForm.OrderDate = this.postForm.OrderDate * 1000;
        this.postForm.PresentationDate = this.postForm.PresentationDate * 1000;
        this.postForm.OrderAmount = this.postForm.OrderAmount/100;
        this.postForm.receivables = this.postForm.receivables/100;
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
      this.postForm.OrderDate = new Date(this.postForm.OrderDate).getTime()/1000;
      this.postForm.PresentationDate = new Date(this.postForm.PresentationDate).getTime()/1000;
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveOrder(this.postForm).then(response => {
            this.$refs.postForm.uuid = generateUUID();
            this.$refs.postForm.resetFields();
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
    showProductDialog() {
        this.productDialogVisible = true;
    },
    onCheckProduct(row) {
        const productData = deepClone(row);
        this.productDialogVisible = false;
        this.postForm.productList.push(
          {
            uuid: generateUUID(),
            orderUuid: this.postForm.uuid,
            productId: productData.id,
            productName: productData.name,
            currentStock: productData.stock,
            inputtime: productData.inputtime,
            costPrice: productData.costPrice,
            sellingPrice: null,
            num: null,
            discount: null,
            totalSum: null,
            info: null,
          }
        );
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
    delProductList(index){
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postForm.delProduct.push(this.postForm.productList[index]);
          this.postForm.productList.splice(index,1);
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
    delEnclosures(index){
        this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postForm.enclosures.splice(index,1);
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
    uploadEnclosures(item){
      const fileObj = item.file;
      // FormData 对象
      const form = new FormData();
      form.append('FILE_UPLOAD', fileObj);
      uploadEnclosures(form).then(response => {
            this.postForm.enclosures.unshift(response.data);
            console.log('response',response);
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
      let month = now.getMonth() + 1
      let day = now.getDate()
      let hour = now.getHours()
      let minutes = now.getMinutes()
      let seconds = now.getSeconds()
      return now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 89 + 100)).toString();
    }
  }
}
</script>

<style lang="scss">
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
        .is-disabled{
          .el-input__inner{
            color: #333;
          }
          
        }
      }
    }
    .product{

    }
    .product .leabel-box{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .product .priceInfo{
      font-size: 14px;
      line-height: 36px;
    }
    .product .priceInfo span{
      color: red;
      padding-right: 20px;
    }
    .product .selectProductBtn{
      height: 30px;
      line-height: 30px;
      font-weight: 400;
      padding: 0 15px;
      font-size: 12px;
      border-radius: 3px;
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
