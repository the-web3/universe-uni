import $ajax from "../common/request.js";

//获取行情列表
export const getMarketPrice = (params) => {
	return $ajax.post({
		url: 'api/get_exchange_market',
		data: params
  })
}

export const getExchanges = data => {
	return $ajax.post({
			url: 'api/get_exchanges',
			data
	})
}