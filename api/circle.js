import $ajax from "../common/request.js";

// 获取文章分类
export const getCatList = (params) => {
	return $ajax.post({
		url: 'api/get_cat_list',
		data: params
  })
}

//获取文章列表
export const getArcticleList = (params) => {
	return $ajax.post({
		url: 'api/get_arcticle_list',
		data: params
  })
}

//获取文章详情
export const getArcticleDetail = (params) => {
	return $ajax.post({
		url: 'api/get_arcticle_detail',
		data: params
  })
}

//获取赞赏地址
export const geLikeAddress = (params) => {
	return $ajax.post({
		url: 'api/get_like_address',
		data: params
  })
}

// 赞赏文章
export const likeArticle = (params) => {
	return $ajax.post({
		url: 'api/like_article',
		data: params
  })
}