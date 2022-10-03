import * as api from './api';
import * as circleApi from './circle';
import * as marketApi from './market';

export default {
    ...api,
    ...circleApi,
	...marketApi
};