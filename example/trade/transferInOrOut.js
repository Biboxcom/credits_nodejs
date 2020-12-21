const { BiboxCreditsClient  } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

transferInOrOut = async () => {
    try {
        await client.transferIn( "USDT", 1, "BTC_USDT"  );

        await client.transferOut( "USDT", 2, "BTC_USDT" );

    }catch ( e ) {
        console.log( e );
    }
};
transferInOrOut();
