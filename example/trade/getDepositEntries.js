const { BiboxCreditsClient, DepositStatus } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

GetDepositEntries = async () => {
    try {
        let entries = await client.getDepositEntries( DepositStatus.ALL, "BTC", 1, 10 );
        console.log( entries );
        // {
        //     count: 1,
        //     page: 1,
        //     items: [
        //     {
        //         symbol: 'BTC',
        //         address: '3GZaHTFpjgCE7wDwSfXY1x4HuaXPzcZ7q9',  // 到账地址
        //         amount: '0.00757999',                           // 数量
        //         confirmations: '6',                             // 区块确认数
        //         time: 1558092442000,
        //         status: 'SUCCESS'
        //     }
        // ]
        // }

    }catch ( e ) {
        console.log( e );
    }
};
GetDepositEntries();
