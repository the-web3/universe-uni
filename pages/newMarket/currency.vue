<template>
  <view class="currency-container">
    <view class="status-bar"></view>
    <view class="currency-title-box">
      <view></view>
      <view class="title">Edit Favorites</view>
      <view class="cancel" @click="handleCancel">Done</view>
    </view>
    <view class="currency-select-list-box">
      <view class="currency-select-title">
        <text>Markets</text>
        <text>Drag</text>
      </view>
      <view class="currency-select-list">
        <checkbox-group name="currencySelect">
          <label class="select-item">
            <view>
              <checkbox value="WBTC" />
              <text>WBTC(ETH)</text>
            </view>
            <image
              class="edit-icon"
              src="../../static/image/edit-four.png"
              mode="aspectFit"
            ></image>
          </label>
          <label class="select-item">
            <view>
              <checkbox value="WBTC" />
              <text>ETH(ETH)</text>
            </view>
            <image
              class="edit-icon"
              src="../../static/image/edit-four.png"
              mode="aspectFit"
            ></image>
          </label>
          <label class="select-item">
            <view>
              <checkbox value="WBTC" />
              <text>BNB(ETH)</text>
            </view>
            <image
              class="edit-icon"
              src="../../static/image/edit-four.png"
              mode="aspectFit"
            ></image>
          </label>
          <label class="select-item">
            <view>
              <checkbox value="WBTC" />
              <text>MATIC(MATIC)</text>
            </view>
            <image
              class="edit-icon"
              src="../../static/image/edit-four.png"
              mode="aspectFit"
            ></image>
          </label>
          <label class="select-item">
            <view>
              <checkbox value="WBTC" />
              <text>UNI(ETH)</text>
            </view>
            <image
              class="edit-icon"
              src="../../static/image/edit-four.png"
              mode="aspectFit"
            ></image>
          </label>
          <label class="select-item">
            <view>
              <checkbox value="WBTC" />
              <text>Cake<text>(BSC)</text></text>
            </view>
            <image
              class="edit-icon"
              src="../../static/image/edit-four.png"
              mode="aspectFit"
            ></image>
          </label>
        </checkbox-group>
      </view>
    </view>
    <view class="edit-box">
      <label class="edit-status">
        <checkbox value="delete" /><text>Select All</text>
      </label>
      <button class="mini-btn" type="primary" size="mini">Delete</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleCancel() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss">
$status_Height: var(--status-bar-height);
.currency-container {
  padding: 10px 20px 61px;
  .currency-title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 27px;
    }
    .cancel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      line-height: 20px;
    }
  }
  .currency-select-list-box {
    margin-top: 20px;
    .currency-select-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-family: DIMMed;
      color: #9397af;
      line-height: 15px;
      margin-bottom: 20px;
    }
    .currency-select-list {
      .select-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        .edit-icon {
          width: 22px;
          height: 22px;
        }
        text {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #222222;
          line-height: 17px;
          margin-left: 10px;
          text {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9397af;
            line-height: 17px;
          }
        }
      }
    }
  }
  .edit-box {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 61px;
    background: #ffffff;
    box-shadow: 0px -10px 10px 0px rgba(76, 110, 245, 0.1);
    padding: 0 20px;
    box-sizing: border-box;
    .edit-status {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .mini-btn {
      margin-right: 0;
      border-radius: 20px;
    }
  }
}
</style>
