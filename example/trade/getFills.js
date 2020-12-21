const { BiboxCreditsClient, TradeSide  } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getFills = async () => {
    try {
        let fillHis = await client.getFills( undefined, undefined, TradeSide.ASK, 1, 10 );
        console.log( fillHis );
        
        let fills = await client.getFillsById( "13098482021704817" );
        console.log( fills );
        // [
        //     {
        //         id: '2251799827208631329',
        //         orderId: '13065496758343573',
        //         symbol: 'BTC_USDT',
        //         tradeSide: 'BID',
        //         price: '19139.990000',
        //         quantity: '0.0001',
        //         isMaker: false,
        //         time: 1608022898000,
        //         fee: { value: '-0.00000020', symbol: 'BTC', payInBIX: false }
        //     }
        // ]

    }catch ( e ) {
        console.log( e );
    }
};
getFills();
