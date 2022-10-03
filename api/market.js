import $ajax from "../common/request.js";

//获取行情列表
export const getMarketPrice = (params) => {
	return $ajax.post({
		url: 'v1/market/get_market_price',
		data: params
  })
}