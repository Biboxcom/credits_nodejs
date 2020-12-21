const { BiboxCreditsClient, TimeInterval } = require( "../../biboxCreditsClient" );
const client = new BiboxCreditsClient();

getCandlestick = async () => {
    try {
        let res = await client.getCandlestick( "BTC_USDT", TimeInterval.DAILY, 10 );
        console.log( res );
        // [
        //     {
        //         time: 1606780800000,
        //         open: '19747.1',
        //         high: '19957.7',
        //         low: '18087',
        //         close: '18785.9',
        //         volume: '410745175'
        //     },
        //     ...
        // ]

    } catch ( e ) {
        console.log( e );
    }
};
getCandlestick();
