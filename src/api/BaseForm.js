import request from '../utils/request';

// 根据用户id获取菜单信息
export const getMenuListByUserId = params => {
    return request({
        url: '/api/menuList/byUserId',
        method: 'get',
        params
    });
};

// 根据菜单id获取菜品信息
export const getDishesListByMenuId = params => {
  return request({
      url: '/api/Dishes/getByMenuId',
      method: 'get',
      params
  });
};

// 删除菜单
export const delMenuById = params => {
  return request({
      url: '/api/menuList/delMenu',
      method: 'get',
      params
  });
};

// 编辑菜单
export const editMenuById = params => {
  return request({
      url: '/api/menuList/editMenu',
      method: 'get',
      params
  });
};

// 添加菜单
export const addMenuById = params => {
  return request({
      url: '/api/menuList/addMenu',
      method: 'get',
      params
  });
};

// 图片上传封装
export const uploadFile =async f => {
  // const f = this.$refs.addPicFile.files[0];
  let file = new FormData();
  let resImg
  file.append("file", f);
  await request.post("/api/uploadFile", file).then((res) => {
    resImg = res
  });
  return resImg;
};


// 图片上传
// export const uploadFile = data => {
//   return request({
//       url: '/api/uploadFile',
//       method:'post',
//       data,
//       headers: { "Content-Type": "multipart/form-data", "boundary":"----WebKitFormBoundaryUIXwMVuQxcs8VXVg" }
//   });
// };

// 添加菜品
export const addDishes = params => {
  return request({
      url: '/api/Dishes/addDishes',
      method: 'post',
      params
  });
};

// 修改菜品
export const editDishes = params => {
  return request({
      url: '/api/Dishes/editById',
      method: 'post',
      params
  });
};

// 删除菜品
export const delDishes = params => {
  return request({
      url: '/api/Dishes/delById',
      method: 'get',
      params
  });
};
