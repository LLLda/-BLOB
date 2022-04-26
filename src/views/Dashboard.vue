<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <img src="../assets/img/img.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{ user.user_name }}</div>
              <div>激活码：{{ user.regist_id }}</div>
            </div>
          </div>
          <div class="user-info-list">
            店名：
            <span>{{user.store_name}}</span>
          </div>
          <div class="user-info-list">
            开店地址：
            <span>{{user.user_address}}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height: 252px">
          <template #header>
            <div class="clearfix">
              <span>今日销量排行</span>
            </div>
          </template>
          爆款烤肉饭
          <el-progress :percentage="10" color="#42b983"></el-progress>双拼烤肉饭
          <el-progress :percentage="8" color="#f1e05a"></el-progress>鸡腿饭
          <el-progress :percentage="5"></el-progress>台式卤肉饭
          <el-progress :percentage="2" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <!-- <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>今日客户量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>今日营业额</div>
                </div>
              </div>
            </el-card>
          </el-col> -->
          <el-col :span="24">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ total }}</div>
                  <div>今日订单量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height: 600px">
          <template #header>
            <div class="clearfix">
              <span>待处理订单</span>
            </div>
          </template>

          <div class="cantainer">
            <el-table
              style="width: 100%"
              :data="
                orderList.slice(
                  (currentPage - 1) * pagesize,
                  currentPage * pagesize
                )
              "
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column label="订单号" prop="order_id" width="140">
              </el-table-column>
              <el-table-column label="取单号" prop="order_number" width="140">
              </el-table-column>
              <el-table-column label="下单时间" prop="order_time" width="180">
              </el-table-column>
              <el-table-column label="订单类型" prop="order_type" width="180">
              </el-table-column>
              <el-table-column label="订单状态" prop="order_status" width="180">
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button class="primary" @click="show(scope.row)"
                    >处理</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 40]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList.length"
            >
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer direction="rtl" v-model="drawer" title="" :with-header="false">
      <el-card class="box-card" body-style="height:100%">
        <template #header>
          <div class="card-header">
            <h2>订单处理</h2>
          </div>
        </template>
        <div>
          <el-table style="width: 100%" :data="goodsList">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column label="子订单号" prop="orderitem_id" width="100">
            </el-table-column>
            <el-table-column
              label="菜品名"
              prop="dishes.dishes_name"
              width="300"
            >
            </el-table-column>
            <el-table-column label="数量" prop="count" width="50">
            </el-table-column>
            <el-table-column label="价格" prop="dishes.dishes_price" width="50">
            </el-table-column>
          </el-table>
        </div>
        <div class="card-btn">
          <el-button @click="changeStatus(statusFlag)">完成订单</el-button>
        </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import Schart from "vue-schart";
import { ElNotification } from "element-plus";
import { reactive } from "vue";
import {
  seachOrderByStatus,
  seachOrderById,
  seachOrderItemByPhone,
  changeOrderById,
  getTodayOrderByTime,
  getUserInfo
} from "../api/dashboard";
import crtTimeFtt from "../utils/index.js";
export default {
  name: "dashboard",
  components: { Schart },
  created() {
    this.init();
    this.getUser();
  },
  data() {
    return {
      total: 0, // 今日订单量
      userId:localStorage.getItem("userId"), // 用户id
      user: {}, // 用户信息
      drawer: false,
      orderList: [],
      currentPage: 1, // 初始页
      pagesize: 5, // 每页展示数据量
      goodsList: [], // 子订单列表
      statusFlag: null, // 被选中行订单id
    };
  },
  methods: {
    // 获取用户信息
    getUser(){
      getUserInfo({userId: this.userId}).then(res=>{
        this.user = res[0]
        console.log(res,77);
        console.log(this.user);
      })
    },
    //   数据初始化 查询所有待处理订单
    init() {
      const myDate = new Date();
      const year = myDate.getFullYear(); //获取当前年
      const mon = myDate.getMonth() + 1; //获取当前月
      const date = myDate.getDate();
      const time = new Date(
        year + "-" + mon + "-" + date + " 00:00:00"
      ).getTime();
      seachOrderByStatus({
        userId: this.userId,
        status: 0,
      }).then((res) => {
        res.map((item) => {
          item.order_time = crtTimeFtt(Number(item.order_time));
          if (item.order_status === 0) {
            item.order_status = "已下单";
          } else {
            item.order_status = "已完成";
          }
          if (item.order_type === 0) {
            item.order_type = "堂食";
          } else {
            item.order_type = "外卖";
          }
        });
        this.orderList = res.reverse();
      });
      getTodayOrderByTime({ time,userId: this.userId}).then((res) => {
        this.total = res.length;
      });
    },
    show(row) {
      this.statusFlag = row.order_id;
      this.goodsList = [];
      this.drawer = true;
      seachOrderById({ id: row.order_id }).then((res) => {
        seachOrderItemByPhone({ phone: res[0].order_phone }).then((res) => {
          res.forEach((item) => {
            if (item.orderItems) {
              item.orderItems.forEach((good) => {
                this.goodsList.push(good);
              });
            }
          });
        });
      });
    },
    changeStatus(id) {
      changeOrderById({ id }).then((res) => {
        ElNotification({
          title: "成功",
          message: "完成订单成功",
          type: "success",
        });
        this.drawer = false;
        this.init();
      });
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
  },
  setup() {
    const name = localStorage.getItem("ms_username");
    const role = name === "admin" ? "超级管理员" : "普通用户";
    const data = reactive([
      {
        name: "2018/09/04",
        value: 1083,
      },
      {
        name: "2018/09/05",
        value: 941,
      },
      {
        name: "2018/09/06",
        value: 1139,
      },
      {
        name: "2018/09/07",
        value: 816,
      },
      {
        name: "2018/09/08",
        value: 327,
      },
      {
        name: "2018/09/09",
        value: 228,
      },
      {
        name: "2018/09/10",
        value: 1065,
      },
    ]);
    const options = {
      type: "bar",
      title: {
        text: "最近一周各品类销售图",
      },
      xRorate: 25,
      labels: ["周一", "周二", "周三", "周四", "周五"],
      datasets: [
        {
          label: "家电",
          data: [234, 278, 270, 190, 230],
        },
        {
          label: "百货",
          data: [164, 178, 190, 135, 160],
        },
        {
          label: "食品",
          data: [144, 198, 150, 235, 120],
        },
      ],
    };
    const options2 = {
      type: "line",
      title: {
        text: "最近几个月各品类销售趋势图",
      },
      labels: ["6月", "7月", "8月", "9月", "10月"],
      datasets: [
        {
          label: "家电",
          data: [234, 278, 270, 190, 230],
        },
        {
          label: "百货",
          data: [164, 178, 150, 135, 160],
        },
        {
          label: "食品",
          data: [74, 118, 200, 235, 90],
        },
      ],
    };
    const todoList = reactive([
      {
        title: "今天要修复100个bug",
        status: false,
      },
      {
        title: "今天要修复100个bug",
        status: false,
      },
      {
        title: "今天要写100行代码加几个bug吧",
        status: false,
      },
      {
        title: "今天要修复100个bug",
        status: false,
      },
      {
        title: "今天要修复100个bug",
        status: true,
      },
      {
        title: "今天要写100行代码加几个bug吧",
        status: true,
      },
    ]);

    return {
      name,
      data,
      options,
      options2,
      todoList,
      role,
    };
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
.card-btn {
  padding-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
