import DB from "@/common/utils/sqlite.js";
export const getWalletList = () => {
    let walletList = [];
    DB.selectTableData('wallet')
    .then((res) => {
		walletList = res;
		console.log('wallet表数据', res)
    })
    .catch((error) => {
		console.log('查询wallet失败', error)
    })
	return walletList
}