const { BiboxCreditsClient  } = require( "../../biboxCreditsClient" );
const apiKey = "2038c3a2d4c1d0a38394c8e7472578557d054111";
const secretKey = "4dafc3c1d18a6f9dff293cf59e732f7617637111";
const client = new BiboxCreditsClient( apiKey, secretKey );

subscribeOrder = () => {
    client.subscribeOrder(  ( data ) => {
        console.log( data );
        // []
    } );
};
subscribeOrder();
