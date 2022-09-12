/*
	封装uni-app请求
*/
import config from "../config.js";
function alert (msg){
	if(!msg){
		return
	}
	uni.showToast({
		title:msg,
		icon:'none'
	})
};

function request(params, method, header) {
	let token = uni.getStorageSync('token') // || 'chainup-76358255-2095-4dd9-932c-274702f99435'
	// let authorization = uni.getStorageSync('token')
	return new Promise(function(resolve, reject) {
		uni.request({
			url: config.base_url + params.url,
			data: params.data,
			method: method,
			header: Object.assign({
				"Api-Token": 'chainup-76358255-2095-4dd9-932c-274702f99435',
				authorization: token // || '5bbabf81-82e5-4487-a7d0-93c175762fa0'
			}, header),
			dataType: 'json',
			success(res) {
				// 成功回调
				// console.log(res)
				if (res.statusCode == 200) {
					if(res.data.code == 2000 && res.data.status) {
						resolve(res.data)
					}else if(res.data.code == 3000 || res.data.code == 3001){
						reject(res.data)
					}else if(res.data.code == 40031 ||res.data.code == 40032){
						reject(res.data)
					}else{
						
						reject(res.data)
					}
				} else {
					uni.showToast({
						title: '请求数据失败:' + res.statusCode,
						icon: 'none'
					})
				}
			},
			fail(e) {
				console.log(e)
				uni.showToast({
					title: '请求失败~',
					icon: "none"
				})
				reject(e)
				// 失败回调
			},
			complete() {
				// 无论成功或失败 只要请求完成的 回调
			}
		})
	})
};
export default {
	async get(params) {
		return await request(params, "GET");
	},
	async post(params,header) {
		return await request(params, "POST", header)
	},
	async put(params) {
		return await request(params, "PUT");
	},
	async delete(params) {
		return await request(params, "DELETE")
	},
}
