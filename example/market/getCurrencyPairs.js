const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const client = new BiboxCreditsClient();

getCurrencyPairs = async () => {
    try {
        let credits = await client.getCurrencyPairs();
        console.log( credits );
        // [
        // {
        //     id: 36,
        //     symbol: 'BTC_USDT',
        //     isolated: { maxLeverage: 10, enabled: true },  // 逐仓配置
        //     cross: { maxLeverage: 10, enabled: true }      // 全仓配置
        // },...
        // ]

    } catch ( e ) {
        console.log( e );
    }
};
getCurrencyPairs();
