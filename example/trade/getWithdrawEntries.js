const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getWithdrawEntries = async () => {
    try {

        let entries = await client.getWithdrawEntries( "", 1, 10 );
        console.log( entries );
        // {
        //     count: 3,
        //     page: 1,
        //     items: [
        //     {
        //         symbol: 'BIX',                                           // 提现币种
        //         address: '0x8D9D4A440125869fBCF71CD485E2cbEdb82f1F2b',   // 地址
        //         amount: '50.00000000',                                   // 数量
        //         fee: '3.00000000',                                       // 手续费
        //         time: 1593496137000,                                     // 提现时间
        //         status: 'FAIL',                                          // 提现状态
        //         memo: ''                                                 // memo
        //     },
        // ]
        // }

    }catch ( e ) {
        console.log( e );
    }
};
getWithdrawEntries();
