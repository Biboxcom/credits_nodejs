const { BiboxCreditsClient  } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getAssetInfo = async () => {
    try {
        let cfgs = await client.getAssetInfos();
        console.log( cfgs );

        let cfg = await client.getAssetInfo( "BTC" );
        console.log( cfg );
        // {
        //     symbol: 'BTC',
        //     precision: 8,                     // 币种原值精度
        //     depositEnabled: true,             // 是否可以充值
        //     withdrawEnabled: true,            // 是否可以提现
        //     withdrawalFee: 0.0008,            // 提现手续费
        //     minWithdraw: 0.005                // 最小提现数量
        // }

    }catch ( e ) {
        console.log( e );
    }
};
getAssetInfo();
