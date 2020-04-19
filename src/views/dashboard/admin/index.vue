<template>
  <div class="dashboard-editor-container">

    <panel-group :data="data" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :date-data="dateData" :contract-amount-chart-data="contractAmountChartData" :receivables-chart-data="receivablesChartData" />
    </el-row>

    <el-row :gutter="32" style="display:none;">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8" style="display:none;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { fetchBi } from '@/api/bi'

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: {
        contractAmountChartData: [],
        receivablesChartData: []
      },
      data: {},
      dateData: [],
      monthDateData: [],
      contractAmountChartData: [],
      receivablesChartData: []
    }
  },
  created() {
    const date = new Date();
    const year = date.getFullYear() + '';
    const month = (date.getMonth() + 1) + '';
    // 本月最后一天日期
    const lastDateOfCurrentMonth = new Date(year, month, 0);
    const lastDate = new Date(lastDateOfCurrentMonth).getDate();

    const dateData = [];
    const monthDateData = [];
    for (let i = 1; i <= lastDate; i++) {
      const s = i < 10 ? '0' + i : i;
      dateData.push(s);
      monthDateData.push(month + '-' + s);
    }
    this.dateData = dateData;
    this.monthDateData = monthDateData;
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchBi().then(response => {
        this.data = response.data;

        const moneyData = response.data.moneyData;
        const contractAmountChartData = [];
        const receivablesChartData = [];

        this.monthDateData.map((v) => {
          let flag = true;
          moneyData && moneyData.map((o) => {
            if (v === o.timestamp) {
              // 应收款
              contractAmountChartData.push(Number(o.ContractAmount) / 100);
              // 实收款
              receivablesChartData.push(Number(o.receivables) / 100);
              flag = false;
            }
          });
          if (flag) {
            contractAmountChartData.push(0);
            receivablesChartData.push(0);
          }
        });

        const lineChartData = { contractAmountChartData, receivablesChartData };
        this.lineChartData = lineChartData;
      });
    },
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
