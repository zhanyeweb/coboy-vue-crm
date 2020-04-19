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
        <div class="postInfo-container">
          <el-col :span="15">
            <el-form-item style="margin-top: 40px;margin-bottom: 40px;" label-width="100px" label="产品名称:" prop="productName">
              <el-input v-model="postForm.productName" :rows="1" :disabled="true" type="text" class="article-input" autosize placeholder="请输入产品名称" />
              <el-button type="success" @click="showProductDialog">
                选择
              </el-button>
            </el-form-item>
          </el-col>
        </div>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="储存仓库:" prop="warehouseId">
          <el-select v-model="postForm.warehouseId" placeholder="请选择">
            <template v-for="group in warehouseData">
              <el-option-group
                v-if="group.children.length > 0"
                :key="group.uuid"
                :label="group.warehouseName"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.uuid"
                  :label="item.warehouseName"
                  :value="item.id"
                />
              </el-option-group>
              <el-option
                v-else
                :key="group.uuid"
                :label="group.warehouseName"
                :value="group.id"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="选择供应商:" prop="supplierId">
          <el-select v-model="postForm.supplierId" placeholder="请选择">
            <template v-for="group in supplierData">
              <el-option-group
                v-if="group.children.length > 0"
                :key="group.uuid"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.id"
                />
              </el-option-group>
              <el-option
                v-else
                :key="group.uuid"
                :label="group.name"
                :value="group.id"
              />
            </template>
          </el-select>
        </el-form-item>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="现有库存:" class="postInfo-container-item">
                <el-input v-model="postForm.currentStock" :rows="1" :disabled="true" type="text" class="article-input" autosize placeholder="请输入库存" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="新采购数量:" class="postInfo-container-item" prop="num">
                <el-input v-model="postForm.num" :rows="1" type="text" class="article-input" autosize placeholder="请输入新采购数量" @blur="onNumBlur" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="单价:" class="postInfo-container-item" prop="unitPrice">
                <el-input v-model="postForm.unitPrice" :rows="1" type="text" class="article-input" autosize placeholder="请输入单价" @blur="onUnitPriceBlur" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="总折扣:" class="postInfo-container-item" prop="totalDiscount">
                <el-input v-model="postForm.totalDiscount" :rows="1" type="text" class="article-input" autosize placeholder="请输入成本价" @blur="onTotalDiscountBlur" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="总成本:" class="postInfo-container-item">
                <el-input v-model="postForm.totalCost" :rows="1" :disabled="true" type="text" class="article-input" autosize placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="总运费:" class="postInfo-container-item">
                <el-input v-model="postForm.totalFreight" :rows="1" type="text" class="article-input" autosize placeholder="请输入总运费" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="支付方式:" class="postInfo-container-item" prop="payType">
                <el-select v-model="postForm.payType" placeholder="请选择">
                  <el-option
                    :label="'现金支付'"
                    :value="1"
                  />
                  <el-option
                    :label="'银行转账'"
                    :value="2"
                  />
                  <el-option
                    :label="'支付宝'"
                    :value="3"
                  />
                  <el-option
                    :label="'支票'"
                    :value="4"
                  />
                  <el-option
                    :label="'其他'"
                    :value="5"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="postInfo-container" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="经办人:" class="postInfo-container-item" prop="personInCharge">
                <el-input v-model="postForm.personInCharge" :rows="1" type="text" class="article-input" autosize placeholder="请输入销售价" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="120px" label="采购日期:" prop="procurementDate" class="postInfo-container-item">
                <el-date-picker
                  v-model="postForm.procurementDate"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item style="margin-bottom: 20px;" label-width="100px" label="备注:">
                <el-input v-model="postForm.info" :rows="4" type="textarea" class="article-textarea" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-dialog width="1000px" :visible.sync="productDialogVisible" :title="'选择产品'">
      <product-dialog :on-check-product="onCheckProduct" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import Sticky from '@/components/Sticky' // 粘性header组件
import ProductDialog from './ProductDialog'
import { validURL } from '@/utils/validate'
import { searchUser } from '@/api/remote-search'
import { fetchList as fetchWarehouseList } from '@/api/warehouse';
import { fetchList as fetchSupplierList } from '@/api/supplier';
import { savePurchases } from '@/api/purchases';
import { getRoles } from '@/api/role';
import { generateUUID } from '@/utils';

const defaultForm = {
  uuid: generateUUID(),
  productId: null,
  warehouseId: null,
  supplierId: null,
  userid: null,
  currentStock: null,
  num: 1,
  unitPrice: null,
  totalDiscount: null,
  totalCost: null,
  totalFreight: null,
  payType: null,
  personInCharge: null,
  procurementDate: null,
  info: null
}
const formLabel = {
  productId: '产品',
  warehouseId: '仓库',
  supplierId: '供应商',
  num: '数量',
  unitPrice: '单价',
  payType: '支付方式',
  personInCharge: '经办人',
  procurementDate: '采购日期'
}

export default {
  name: 'PurchasesDetail',
  components: { Sticky, ProductDialog },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log('value', value);
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
      userListOptions: [],
      rules: {
        name: [{ validator: validateRequire }],
        cateUuid: [{ validator: validateRequire }],
        stock: [{ validator: validateRequire }],
        costPrice: [{ validator: validateRequire }],
        sellingPrice: [{ validator: validateRequire }]
      },
      tempRoute: {},
      warehouseData: [],
      supplierData: [],
      listWarehouseQuery: {
        page: 1,
        rows: 999
      },
      productDialogVisible: false
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
      const uuid = this.$route.params && this.$route.params.uuid;
      this.fetchData(uuid);
    }
    this.getFetchWarehouseList();
    this.getFetchSupplierList();
    this.getUser();
  },
  methods: {
    getFetchWarehouseList() {
      this.listLoading = true
      fetchWarehouseList(this.listWarehouseQuery).then(response => {
        console.log('response', response)
        const data = response.data.items;
        const _f = (puuid, item) => {
          item = item && item.filter(it => it.puuid === puuid);
          item && item.map((v) => {
            const childData = _f(v.uuid, data);
            v.children = childData;
          });
          console.log('item', item);
          return item;
        };
        const treeData = _f('0', data);
        console.log('treeData', treeData);
        this.warehouseData = treeData;
        this.listLoading = false
      })
    },
    getFetchSupplierList() {
      this.listLoading = true
      fetchSupplierList(this.listWarehouseQuery).then(response => {
        console.log('response', response)
        const data = response.data.items;
        const _f = (puuid, item) => {
          item = item && item.filter(it => it.puuid === puuid);
          item && item.map((v) => {
            const childData = _f(v.uuid, data);
            v.children = childData;
          });
          console.log('item', item);
          return item;
        };
        const treeData = _f('0', data);
        console.log('treeData', treeData);
        this.supplierData = treeData;
        this.listLoading = false
      })
    },
    onUnitPriceBlur() {
      this.postForm.totalCost = Number(this.postForm.unitPrice) * Number(this.postForm.num);
    },
    onNumBlur() {
      this.postForm.totalCost = Number(this.postForm.unitPrice) * Number(this.postForm.num);
    },
    onTotalDiscountBlur() {
      this.postForm.totalCost = this.postForm.totalCost - Number(this.postForm.totalDiscount);
    },
    getUser() {
      this.postForm.userid = this.userid;
    },
    showProductDialog() {
      this.productDialogVisible = true;
    },
    fetchData(uuid) {
      fetchProduct(uuid).then(response => {
        this.postForm = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑产品'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑产品'
      document.title = `${title} - ${this.postForm.name}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postForm.procurementDate = this.postForm.procurementDate / 1000;
          savePurchases(this.postForm).then(response => {
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
          return false;
        }
      })
    },
    onCheckProduct(row) {
      const productData = deepClone(row);
      this.productDialogVisible = false;
      this.postForm.productId = productData.id;
      this.postForm.productName = productData.name;
      this.postForm.currentStock = productData.stock;
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
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

.article-input {
  width: 80%;
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
.uploadExcel{
  display: inline-block;
}
</style>
