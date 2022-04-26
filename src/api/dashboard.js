import request from '../utils/request';

// 根据订单状态查询订单信息
export const seachOrderByStatus = params => {
    return request({
        url: '/api/getOrder/byStatus',
        method: 'get',
        params
    });
};

// 根据订单id查询订单信息
export const seachOrderById = params => {
    return request({
        url: '/api/getOrder/byId',
        method: 'get',
        params
    });
};

// 根据电话查询订单及子订单信息
export const seachOrderItemByPhone = params => {
    return request({
        url: '/api/getOrderItem/byPhone',
        method: 'get',
        params
    });
};

// 根据订单id修改订单状态
export const changeOrderById = params => {
    return request({
        url: '/api/getOrder/changeById',
        method: 'get',
        params
    });
};

// 根据时间戳获取今天所有订单
export const getTodayOrderByTime = params => {
    return request({
        url: '/api/getOrder/getTodayOrder',
        method: 'get',
        params
    });
};

// 根据用户id获取用户信息
export const getUserInfo = params => {
    return request({
        url: '/api/user/getUserById',
        method: 'get',
        params
    });
};