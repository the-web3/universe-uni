import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

//请求接口
import api from './api';
import hook from './common/dapp/hook.js'
Vue.prototype.$api = api;


// 无状态提示信息
Vue.prototype.$alert = function(msg){
	if(!msg){
		return
	}
	uni.showToast({
		title:msg,
		icon:'none'
	})
};

const app = new Vue({
    ...App
})
app.$mount()
