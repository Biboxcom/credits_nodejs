const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const client = new BiboxCreditsClient();

subscribeTicker = () => {
    client.subscribeTicker( "BTC_USDT", ( data ) => {
        console.log( data );
        // {
        //     symbol: '5BTC_USD',
        //     change: '+1.06%',            //24小时涨幅
        //     time: 1607583068884,
        //     volume: '265944068',
        //     price: '18355.9',
        //     priceInCNY: '118028.40000000',
        //     priceInUSD: '18355.90',
        //     high: '18628.2',
        //     low: '17659.7',
        //     bestAskPrice: '18356',       //最新卖一价
        //     bestAskQty: '141812',
        //     bestBidPrice: '18355.9',     // 最新买一价
        //     bestBidQty: '21010'
        // }
    } );
};
subscribeTicker();
