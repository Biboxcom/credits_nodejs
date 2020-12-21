const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const client = new BiboxCreditsClient();

subscribeOrderBook = () => {
    client.subscribeOrderBook( "BTC_USDT", ( data ) => {
        console.log( "BTC ask1", data.asks[0] );
        console.log( "BTC bid1", data.bids[0] );
    } );

};
subscribeOrderBook();
