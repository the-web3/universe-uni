import $ajax from "../common/request.js";

//获取行情列表
export const getMarketPrice = (params) => {
	return $ajax.post({
		url: 'v1/market/get_market_price',
		data: params
  })
}

//获取资讯列表
export const getNewsList = (params) => {
	return $ajax.post({
		url: 'v1/news/get_news_list',
		data: params
  })
}

//获取资讯详情
export const getNewsDetail = (params) => {
	return $ajax.post({
		url: 'v1/news/news_detail',
		data: params
  })
}