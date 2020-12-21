const { BiboxCreditsClient, BillType  } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getBills = async () => {
    try {
        let bills = await client.getBills( undefined, undefined, BillType.TRANSFER_IN, 1, 10 );
        console.log( bills );
        // {
        //     count: 5,
        //     page: 1,
        //     items: [
        //     {
        //         symbol: 'USDT',
        //         time: 1608022371000,
        //         change: '7.49265531',  // 资产改变
        //         result: '7.49265532',  // 资产改变后的余额
        //         type: 'TRANSFER_IN'
        //     },...
        // ]
        // }


    }catch ( e ) {
        console.log( e );
    }
};
getBills();
