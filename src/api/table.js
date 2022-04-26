import request from "../utils/request";

// 根据用户id查询订单
// export const getOrderByUserId = params => {
//   return request({
//       url: '/api/getOrder/byUserId',
//       method: 'get',
//       params
//   });
// };

// 获取兑换记录
export const getRecordByType = (params) => {
  return request({
    url: "/api/commodity/getCommodityRecordByType",
    method: "get",
    params,
  });
};

// 兑换状态修改
export const editCommodityById = params => {
  return request({
      url: '/api/commodity/editCommodityRecord',
      method: 'get',
      params
  });
};

// 获取商品信息
export const getCommodity = params => {
  return request({
      url: '/api/commodity/getCommodity',
      method: 'get',
      params
  });
};

//修改商品信息
export const editCommodity = params => {
  return request({
      url: '/api/commodity/editCommodity',
      method: 'post',
      params
  });
}; 

//添加商品
export const addCommodity = params => {
  return request({
      url: '/api/commodity/addCommodity',
      method: 'post',
      params
  });
}; 