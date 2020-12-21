const { BiboxCreditsClient, TradeSide  } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getOrders = async () => {
    try {
        let order = await client.getOrder( "13065496758343573" );
        console.log( order );
        // {
        //     side: 'BID',
        //     quantity: '0.0001',               // 委托数量
        //     price: '19140.500000',            // 委托价格
        //     createTime: 1608022898000,        // 委托时间
        //     executedQty: '0.0001',            // 成交数量
        //     orderId: '13065496758343573',     // 订单id
        //     status: 'FILLED',                 // 订单状态
        //     symbol: 'BTC_USDT'
        // }

        let opens = await client.getOpenOrders( undefined, "USDT", TradeSide.ASK, 1, 10 );
        console.log( opens );

        let historys = await client.getClosedOrders( undefined, "USDT", TradeSide.ASK, 1, 10 );
        console.log( historys );

    }catch ( e ) {
        console.log( e );
    }
};
getOrders();
