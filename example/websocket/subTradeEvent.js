const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const client = new BiboxCreditsClient();

subscribeTrade = () => {
    client.subscribeTrade( "BTC_USDT", ( data ) => {
        console.log( data[0] );
        // {
        //     symbol: 'BTC_USDT',
        //     side: 'SHORT',
        //     price: '18340.1',
        //     quantity: '7875',
        //     time: 1607583162936
        // }
    } );

};
subscribeTrade();
