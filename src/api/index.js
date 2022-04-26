import request from '../utils/request';

export const loginCheck = params => {
    return request({
        url: '/api/userB/check',
        method: 'get',
        params
    });
};

export const editUser = params => {
    return request({
        url: '/api/userB/edit',
        method: 'post',
        params
    });
};

// 获取公告
export const getAnnouncement = params => {
    return request({
        url: '/api/announcement/getList',
        method: 'get',
        params
    });
};

// 新增公告
export const addAnnouncement = params => {
    return request({
        url: '/api/announcement/addAnnouncement',
        method: 'post',
        params
    });
};

// 获取分区
export const getClassify = params => {
    return request({
        url: '/api/classify/getList',
        method: 'get',
        params
    });
};

// 修改分区
export const editClassify = params => {
    return request({
        url: '/api/classify/edit',
        method: 'post',
        params
    });
};

// 新增分区
export const addClassify = params => {
    return request({
        url: '/api/classify/add',
        method: 'post',
        params
    });
};