
<h1 align="center">Welcome to Bibox Credits Client 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-v1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Bibox平台信用(杠杆)交易Nodejs版本SDK

### 🏠 [Homepage](https://www.bibox.me/v2/exchange)

## Dependency

```sh
需要 node v14+
```

## Usage

```sh
// 新建客户端对象 公开的api可以不传apiKey与secretKey
const { BiboxCreditsClient  } = require( "../../biboxFuturesClient" );
const apiKey = "Your apiKey";
const secretKey = "Your secretKey";
const client = new BiboxCreditsClient( apiKey, secretKey );
        
// 公开的api 获取kline
let res = await client.getCandlestick( "BTC_USDT", TimeInterval.DAILY, 10 );
console.log( res );

// 用户的api 借款/还款
await client.borrow( "USDT", 1, "BTC_USDT" );
await client.refund( "USDT", 1, "BTC_USDT" );

// 用户的api 转入或转出信用账户
await client.transferIn( "USDT", 1, "BTC_USDT"  );
await client.transferOut( "USDT", 2, "BTC_USDT" );

// 用户的api 下单
let orderId = await client.placeLimitOrder( {
    symbol: "BTC_USDT",
    quantity: 0.0001,
    price: 23000,
    tradeSide: TradeSide.BID,
    marginMode: MarginMode.ISOLATED
} );
console.log( orderId );

// 公开的订阅 订阅kline
client.subscribeCandlestick( "BTC_USD", TimeInterval.ONE_MINUTE, ( data ) => {
    console.log( "BTC_USDT", data );
} );

// 用户的订阅 用户资产数据
client.subscribeAccount(  ( data ) => {
    console.log( data );
} );

// 更多的可以参考测试用例
```

## Author

👤 **Biboxcom**

* Website: https://github.com/Biboxcom
* Github: [@Biboxcom](https://github.com/Biboxcom)

## Show your support

Give a ⭐️ if this project helped you!


