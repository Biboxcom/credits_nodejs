const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const client = new BiboxCreditsClient();

getTrades = async () => {
    try {
        let ticker  = await client.getTrades( "BTC_USDT", 2 );
        console.log( ticker );
        // [
        //     {
        //         symbol: 'BTC_USDT',
        //         side: 'BID',
        //         price: '19454.5800',    // 成交价
        //         quantity: '0.00330000', // 成交数量
        //         time: 1608110307705     // 时间
        //     },
        //     {
        //         symbol: 'BTC_USDT',
        //         side: 'BID',
        //         price: '19454.5700',
        //         quantity: '0.00100000',
        //         time: 1608110307691
        //     }
        // ]

    } catch ( e ) {
        console.log( e );
    }
};
getTrades();
