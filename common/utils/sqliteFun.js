import DB from "@/common/utils/sqlite.js";
export const getWalletList = async (key, value) => {
    let walletList = [];
    await DB.selectTableData('wallet', key, value)
    .then((res) => {
      walletList = res;
      console.log('wallet表数据', res)
    })
    .catch((error) => {
		  console.log('查询wallet失败', error)
    })
	return walletList
}

export const getChainInfo = async (type) => {
    const res = await DB.selectTableData('chain', 'name', type)
	return res[0]||[]
}