const { BiboxCreditsClient } = require( "../../biboxCreditsClient" );
const apiKey = "2aa4a99148c65c4dbaed3a9718c87f83fc5d333e";
const secretKey = "a05f00a59a1ffbf7e3a88b10f0e658e6a77ba474";
const client = new BiboxCreditsClient( apiKey, secretKey );

getDepositEntries = async () => {
    try {
        let p = await client.getPosition( "BTC_USDT" );
        console.log( p );
        // {
        //     symbol: 'BTC_USDT',              // 仓位名称
        //     available: '0.00000000',         // 可用资产
        //     loan: '0.00000000',              // 借款
        //     borrowingLimit: '0.00000000',    // 可借
        //     currentMargin: '-0.01',          // 保证金率
        //     maxLeverage: '10',               // 最大杠杠
        //     currentLeverage: '10',           // 当前杠杠
        //     liquidationPrice: '0',           // 爆仓价格
        //     maintenanceMargin: '1.06',       // 爆仓保证金率
        //     assets: [
        //     {
        //         asset: 'USDT',               // 资产名称
        //         available: '0.00000000',     // 可用
        //         borrow: '0.00000000',        // 冻结
        //         freeze: '0.00000000',        // 利息
        //         interest: '0.00000000'       // 借款
        //     },
        //     {
        //         asset: 'BTC',
        //         available: '0.00000000',
        //         borrow: '0.00000000',
        //         freeze: '0.00000000',
        //         interest: '0'
        //     }
        // ]
        // }

    }catch ( e ) {
        console.log( e );
    }
};
getDepositEntries();
