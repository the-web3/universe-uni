<template>
  <view class="new-market-container" v-if="tabs.length">
    <view class="status-bar"></view>
    <v-tabs
      v-model="activeTab"
      :scroll="tabs.length >= 6"
      :tabs="tabs.map((item) => item.name)"
      fontSize="30rpx"
      color="#222222"
      activeColor="#222222"
      @change="handleTabsChange"
    ></v-tabs>
    <view class="gray-line"></view>
    <view class="follow-currency-container">
      <view class="follow-currency-head">
        <view class="name-box">
          Name<image
            class="sort-icon"
            src="../../static/image/shangxia@2x.png"
            mode="aspectFit"
          ></image>
          <!-- <text>/24h vol</text
          ><image
            class="sort-icon"
            src="../../static/image/shangxia@2x.png"
            mode="aspectFit"
          ></image> -->
        </view>
        <view class="price-box"
          >Price<image
            class="sort-icon"
            src="../../static/image/shangxia@2x.png"
            mode="aspectFit"
          ></image
        ></view>
        <view class="change-box"
          >24h Change<image
            class="sort-icon"
            src="../../static/image/shangxia@2x.png"
            mode="aspectFit"
          ></image>
          <navigator url="./currency">
            <image
              class="edit-icon"
              src="../../static/image/edit-bybit.png"
              mode="aspectFit"
            ></image
          ></navigator>
        </view>
      </view>
      <view class="follow-currency-body">
        <view class="follow-currency-data-list">
          <view
            class="follow-currency-data-item"
            url="./detail"
            v-for="item in exchangeList"
            :key="item.id"
          >
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">{{ item.qoute_asset }}</text
                >/{{ item.base_asset }}
              </view>
              <view>{{ item.exchange }} </view>
              <!-- <view class="mb10 big-font light-color">{{ item.exchange }}</view> -->
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">{{
                item.usd_price
              }}</view>
              <view>¥{{ item.cny_price }}</view>
            </view>
            <view class="change-item">
              <view
                :class="{
                  'change-h': item.margin.includes('-'),
                  'change-l': item.margin.includes('+'),
                }"
              >
                {{ item.margin }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getExchanges, getMarketPrice } from "@/api/market.js";
export default {
  data() {
    return {
      activeTab: 0,
      tabs: [],
      exchangeList: [],
      deviceId: "0",
      timer: null,
    };
  },
  onLoad() {
    // 获取设备信息
    // #ifdef APP-PLUS
    plus.device.getInfo({
      success: (e) => {
        this.deviceId = e.uuid;
        console.log("getDeviceInfo success: " + JSON.stringify(e));
      },
      fail: (e) => {
        console.log("getDeviceInfo failed: " + JSON.stringify(e));
      },
    });
    // #endif
  },
  onShow() {
    this.getExchanges();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.getMarketPrice(this.tabs[this.activeTab].id);
    }, 1500);
  },
  onHide() {
    clearInterval(this.timer);
  },
  methods: {
    async getExchanges() {
      // 获取币种
      try {
        const res = await getExchanges({ type: "Cex" });
        console.log(res, "getExchanges");
        if (+res.code !== 200) {
          return uni.showToast({ title: res.msg, icon: "none" });
        }
        this.tabs =
          [
            {
              id: "",
              market_type: "Cex",
              name: "Favorites",
              status: "Active",
            },
            ...res.result,
          ] || [];
        this.getMarketPrice(this.tabs[0].id);
      } catch (err) {
        uni.showToast({ title: err.msg, icon: "none" });
      }
    },
    async getMarketPrice(exchange_id) {
      try {
        let params = { device_id: this.deviceId };
        exchange_id ? (params.exchange_id = exchange_id) : null;
        const res = await getMarketPrice(params);
        console.log(res, "getMarketPrice");
        if (+res.code !== 200) {
          return uni.showToast({ title: res.msg, icon: "none" });
        }
        this.exchangeList = res.result || [];
      } catch (err) {
        uni.showToast({ title: err.msg, icon: "none" });
      }
    },
    handleTabsChange(index) {
      this.exchangeList = [];
      this.getMarketPrice(this.tabs[index].id);
    },
  },
};
</script>

<style lang="scss">
$status_Height: var(--status-bar-height);
.new-market-container {
  .gray-line {
    width: 100%;
    height: 1px;
    background-color: #f7f8fc;
    margin-top: 4px;
  }
  .follow-currency-container {
    padding: 2px 20rpx;
    font-size: 16px;
    font-family: DIMMed;
    color: #9397af;
    line-height: 15px;
    margin-top: 10px;
    .follow-currency-head {
      display: flex;
      margin: 8px 0;
      .sort-icon {
        width: 24rpx;
        height: 24rpx;
        margin-left: 5px;
      }
      .edit-icon {
        width: 40rpx;
        height: 40rpx;
        margin-left: 5px;
      }
      .name-box {
        width: 30%;
        display: flex;
        align-items: center;
        text {
          margin-left: 5px;
        }
      }
      .price-box {
        width: 30%;
        display: flex;
        align-items: center;
      }
      .change-box {
        width: 40%;
        display: flex;
        align-items: center;
      }
    }
    .follow-currency-body {
      .follow-currency-data-list {
        .follow-currency-data-item {
          display: flex;
          margin: 20px 0;
          .name-item {
            width: 30%;
            .big-font {
              font-size: 18px;
              line-height: 20px;
            }
            .light-color {
              color: #222222;
            }
          }
          .price-item {
            width: 30%;
            .big-font {
              font-size: 20px;
              line-height: 22px;
            }
            .light-color {
              color: #222222;
            }
          }
          .change-item {
            width: 40%;
            display: flex;
            justify-content: center;
            align-items: center;
            view {
              width: 90px;
              height: 40px;
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .change-h {
              background: url(../../static/image/hong@2x.png) center center
                no-repeat;
              background-size: 100% 100%;
            }
            .change-l {
              background: url(../../static/image/lv@2x.png) center center
                no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
  }
}
</style>
