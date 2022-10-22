<template>
  <view class="new-market-container">
    <v-tabs
      v-model="activeTab"
      :scroll="tabs.length >= 6"
      :tabs="tabs"
      fontSize="30rpx"
      color="#222222"
      activeColor="#222222"
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
          <text>/24h vol</text
          ><image
            class="sort-icon"
            src="../../static/image/shangxia@2x.png"
            mode="aspectFit"
          ></image>
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
          <navigator class="follow-currency-data-item" url="./detail">
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">LUNC</text>/USDT
                <text class="light-color">-Bybit</text>
              </view>
              <view> 24h turnover ¥79.21M </view>
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">0.89</view>
              <view>¥241.23</view>
            </view>
            <view class="change-item">
              <view class="change-h"> -25.00% </view>
            </view>
          </navigator>
          <view class="follow-currency-data-item">
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">LUNC</text>/USDT
                <text class="light-color">-Bybit</text>
              </view>
              <view> 24h turnover ¥79.21M </view>
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">0.89</view>
              <view>¥241.23</view>
            </view>
            <view class="change-item">
              <view class="change-l"> -25.00% </view>
            </view>
          </view>
          <view class="follow-currency-data-item">
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">LUNC</text>/USDT
                <text class="light-color">-Bybit</text>
              </view>
              <view> 24h turnover ¥79.21M </view>
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">0.89</view>
              <view>¥241.23</view>
            </view>
            <view class="change-item">
              <view class="change-h"> -25.00% </view>
            </view>
          </view>
          <view class="follow-currency-data-item">
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">LUNC</text>/USDT
                <text class="light-color">-Bybit</text>
              </view>
              <view> 24h turnover ¥79.21M </view>
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">0.89</view>
              <view>¥241.23</view>
            </view>
            <view class="change-item">
              <view class="change-l"> -25.00% </view>
            </view>
          </view>
          <view class="follow-currency-data-item">
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">LUNC</text>/USDT
                <text class="light-color">-Bybit</text>
              </view>
              <view> 24h turnover ¥79.21M </view>
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">0.89</view>
              <view>¥241.23</view>
            </view>
            <view class="change-item">
              <view class="change-h"> -25.00% </view>
            </view>
          </view>
          <view class="follow-currency-data-item">
            <view class="name-item">
              <view class="mb10">
                <text class="big-font light-color">LUNC</text>/USDT
                <text class="light-color">-Bybit</text>
              </view>
              <view> 24h turnover ¥79.21M </view>
            </view>
            <view class="price-item">
              <view class="big-font light-color mb10">0.89</view>
              <view>¥241.23</view>
            </view>
            <view class="change-item">
              <view class="change-l"> -25.00% </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      tabs: ["Favorites", "Binance", "Okx", "Bybit", "FTX"],
    };
  },
  methods: {},
};
</script>

<style lang="scss">
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
        width: 45%;
        display: flex;
        align-items: center;
        text {
          margin-left: 5px;
        }
      }
      .price-box {
        width: 20%;
        display: flex;
        align-items: center;
      }
      .change-box {
        width: 35%;
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
            width: 50%;
            .big-font {
              font-size: 18px;
              line-height: 20px;
            }
            .light-color {
              color: #222222;
            }
          }
          .price-item {
            width: 20%;
            .big-font {
              font-size: 20px;
              line-height: 22px;
            }
            .light-color {
              color: #222222;
            }
          }
          .change-item {
            width: 30%;
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
