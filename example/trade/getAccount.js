const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getAccount = async () => {
    try {
        let accounts = await client.getMainAccounts();
        console.log( accounts );

        let account = await client.getMainAccount( "IRIS" );
        console.log( account );
        // {
        //     "asset": "BTC",
        //     "available": "0.80217257",  // 可用
        //     "freeze": "0.00000000"       // 冻结
        // }

    }catch ( e ) {
        console.log( e );
    }
};
getAccount();
