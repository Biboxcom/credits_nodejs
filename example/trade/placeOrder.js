const { BiboxCreditsClient, TradeSide, MarginMode  } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

placeOrder = async () => {
    try {
        let orderId = await client.placeLimitOrder( {
            symbol: "BTC_USDT",
            quantity: 0.0001,
            price: 23000,
            tradeSide: TradeSide.BID,
            marginMode: MarginMode.ISOLATED
        } );
        console.log( orderId );

    }catch ( e ) {
        console.log( e );
    }
};
placeOrder();
