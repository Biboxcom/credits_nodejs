/*
 * Copyright (C) 2020, Bibox.com. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

const BigNumber = require( 'bignumber.js' );
const got = require( "got" );
const CryptoJS = require( "crypto-js" );
let events = require( "events" );
const emitter = new events.EventEmitter();
const WebSocket = require( 'ws' );
const zlib = require( 'zlib' );
// const { Worker, isMainThread, parentPort } = require( 'worker_threads' );
// const sleep = ( delay ) => new Promise( ( resolve ) => setTimeout( resolve, delay ) );
const defaultConfig = {
    apiKey: "",
    secretKey: "",
    restHost: "https://api.bibox666.com",
    wssHost: "wss://mopush.bibox360.com",
    referer: "https://www.bibox.pro",
    origin: "https://www.bibox.pro"
};

const MarketUrl = {
    CANDLESTICK: "/v3/mdata/kline",
    ORDER_BOOK: "/v3/mdata/depth",
    CREDIT_LIST: "/v3.1/credit/coinBorrow/pairList",
    TICKER: "/v3/mdata/ticker",
    DEALS: "/v3/mdata/deals"
};

const PrivateUrl = {
    BORROW: "/v3.1/credit/borrowOrder/autobook",
    CANCEL_ORDER: "/v3.1/credit/trade/cancel",
    MAIN_ACCOUNT: "/v3.1/transfer/mainAssets",
    BORROWER_ASSET: "/v3.1/credit/transferAssets/borrowAssets",
    REFUND: "/v3.1/credit/borrowOrder/refund",
    BILLS: "/v3.1/transfer/bills",
    TRADES: "/v3.1/orderpending/orderDetail",
    TRADES_HISTORY: "/v3.1/orderpending/orderHistoryList",
    COIN_CONFIG: "/v3.1/transfer/coinConfig",
    GET_DEPOSIT_ADDR: "/v3.1/transfer/transferIn",
    DEPOSIT_ENTRIES: "/v3.1/transfer/transferInList",
    URL_ORDER_DETAIL: "/v3.1/orderpending/order",
    ORDER_PENDING_LIST: "/v3.1/orderpending/orderPendingList",
    ORDER_HISTORY_LIST: "/v3.1/orderpending/pendingHistoryList",
    URL_WITHDRAW_ENTRIES: "/v3.1/transfer/transferOutList",
    PLACE_ORDER: "/v3.1/credit/trade/trade",
    WITHDRAW: "/v3.1/transfer/transferOut",
    TRANSFER_CREDIT: "/v3.1/credit/transferAssets/base2credit",
    TRANSFER_CREDIT_TO_MAIN: "/v3.1/credit/transferAssets/credit2base"
};

const TimeInterval = Object.freeze( {
    ONE_MINUTE: "1min",
    THREE_MINUTES: "3min",
    FIVE_MINUTES: "5min",
    FIFTEEN_MINUTES: "15min",
    HALF_HOURLY: "30min",
    HOURLY: "1hour",
    TWO_HOURLY: "2hour",
    FOUR_HOURLY: "4hour",
    SIX_HOURLY: "6hour",
    TWELVE_HOURLY: "12hour",
    DAILY: "day",
    WEEKLY: "week"
} );

const TradeSide = Object.freeze( {
    BID: "BID",
    ASK: "ASK"
} );

const DepositStatus = Object.freeze( {
    ALL: "ALL",
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL"
} );

const MarginMode = Object.freeze( {
    CROSS: "CROSS",
    ISOLATED: "ISOLATED"
} );

const OrderStatus = Object.freeze( {
    CREATED: "CREATED",
    PARTIAL_FILLED: "PARTIAL_FILLED",
    FILLED: "FILLED",
    PARTIAL_CANCELED: "PARTIAL_CANCELED",
    CANCELED: "CANCELED",
    REJECTED: "REJECTED"
} );

const BillType = Object.freeze( {
    TRANSFER_IN: "TRANSFER_IN",
    TRANSFER_OUT: "TRANSFER_OUT",
    BID: "BID",
    ASK: "ASK",
    UNDEFINED: "UNDEFINED",
} );

const ApiDepositStatus = Object.freeze( {
    ALL: 0,
    PENDING: 1,
    SUCCESS: 2,
    FAIL: 3,

    fromInteger: ( num ) => {
        switch ( num ) {
            case 0:
                return "ALL";
            case 1:
                return "PENDING";
            case 2:
                return "SUCCESS";
            case 3:
                return "FAIL";
        }
    }
} );

const ApiWithDrawEntryStatus = Object.freeze( {
    PENDING: 1,
    SUCCESS: 2,
    FAIL: 3,
    CANCEL: 4,

    fromInteger: ( num ) => {
        switch ( num ) {
            case 1:
                return "PENDING";
            case 2:
                return "SUCCESS";
            case 3:
                return "FAIL";
            case 4:
                return "CANCEL";
        }
    }
} );

const ApiOrderStatus = Object.freeze( {
    REJECTED: -1,
    CREATED: 1,
    PARTIAL_FILLED: 2,
    FILLED: 3,
    PARTIAL_CANCELED: 4,
    CANCELED: 5,
    WAIT_CANCEL: 6,

    fromInteger: ( num ) => {
        switch ( num ) {
            case -1:
                return "REJECTED";
            case 1:
                return "CREATED";
            case 2:
                return "PARTIAL_FILLED";
            case 3:
                return "FILLED";
            case 4:
                return "PARTIAL_CANCELED";
            case 5:
                return "CANCELED";
            case 6:
                return "WAIT_CANCEL";
        }
    }
} );

const ApiMarginMode = Object.freeze( {
    CROSS: 257,
    ISOLATED: 1,
    fromInteger: ( num ) => {
        switch ( num ) {
            case 257:
                return "CROSS";
            case 1:
                return "ISOLATED";
        }
    }
} );

const ApiBillType = Object.freeze( {
    TRANSFER_IN: 21,
    TRANSFER_OUT: 22,
    BID: 5,
    ASK: 3,
    BORROW: 10,
    REFUND: 15,
    UNDEFINED: -1,

    fromInteger: ( num ) => {
        switch ( num ) {
            case 21:
                return "TRANSFER_IN";
            case 22:
                return "TRANSFER_OUT";
            case 5:
                return "BID";
            case 3:
                return "ASK";
            case 10:
                return "BORROW";
            case 15:
                return "REFUND";
            case -1:
                return "UNDEFINED";
        }
    }
} );

const ApiTradeSide = Object.freeze( {
    BID: 1,
    ASK: 2,

    fromInteger: ( num ) => {
        switch ( num ) {
            case 1:
                return "BID";
            case 2:
                return "ASK";
        }
    }
} );

class BiboxCreditsClientBase {

    constructor( apiKey, secretKey ) {
        this._apiKey = apiKey || defaultConfig.apiKey;
        this._secretKey = secretKey || defaultConfig.secretKey;
        this._restHost = defaultConfig.restHost;
        this._wssHost = defaultConfig.wssHost;
        this._referer = defaultConfig.referer;
        this._origin = defaultConfig.origin;

        this._subscriptions = {};
        this._wss = null;
        this._pingTimeout = null;
        this._wssOpened = false;
    }

    setRestHost = ( restHost ) => {
        this._restHost = restHost;
    }

    setWssHost = ( wssHost ) => {
        this._wssHost = wssHost;
    }

    _onWebSocketOpen = () => {
        this._wssOpened = true;
        emitter.on( "sub_channel", ( channel ) => {
            if ( channel && this._subscriptions[channel] ) {
                this._wss.send( this._subscriptions[channel] );
                return;
            }
            for ( const sub of Object.values( this._subscriptions ) ) {
                this._wss.send( sub.toString() );
            }
        } );

        emitter.on( "unsub_channel", ( channel ) => {
            if ( channel && this._subscriptions[channel] ) {
                this._wss.send( JSON.stringify( {
                    "channel": this._subscriptions.getChannel(),
                    "event": "removeChannel"
                } ) );
                delete this._subscriptions[channel];
            }
        } );

        emitter.on( "unsub_private_channel", ( channel ) => {
            this._wss.send( JSON.stringify( {
                "channel": this._subscriptions.getChannel(),
                "event": "removeChannel"
            } ) );
            for ( let key of Object.keys( this._subscriptions ) ) {
                if ( key.indexOf( channel ) !== -1 ) {
                    delete this._subscriptions[key];
                }
            }
        } );
    }

    _subscribe = ( sub ) => {
        let channel = sub.getChannel();
        if ( !this._subscriptions.hasOwnProperty( channel ) ) {
            this._subscriptions[channel] = sub;
        }
        if ( this._wssOpened ) {
            emitter.emit( "sub_channel", channel );
        }
        this._initWss();
    }

    _unsubscribe = ( channel ) => {
        if ( this._wssOpened ) {
            emitter.emit( "unsub_channel", channel );
        }
    }
    _unsubscribeAllPrivateSubscriptions = () => {
        if ( this._wssOpened ) {
            emitter.emit( "unsub_private_channel", PrivateSubscription.CHANNEL_PREFIX );
        }
    }

    _heartbeat = () => {
        if ( this._pingTimeout ) {
            clearTimeout( this._pingTimeout );
        }

        this._pingTimeout = setTimeout( () => {
            this._wss.terminate();
            this._wss = null;
            this._initWss();
        }, 70000 );
    };

    _loopPing = () => {
        if ( this._keepLive ) {
            clearTimeout( this._keepLive );
        }

        this._keepLive = setTimeout( () => {
            this._wss.ping( new Date().getTime() );
            this._loopPing();
        }, 20000 );
    };

    _delayReconnect = ( ms = 3000 ) => {
        const timer = setTimeout( () => {
            this._reconnect();
            clearTimeout( timer );
        }, ms );
    };
    _reconnect = () => {
        if ( this._wss ) {
            let __wss = this._wss;
            __wss.removeAllListeners();
            __wss.on( "error", () => {} );
            if ( __wss.readyState !== __wss.CONNECTING ) {
                __wss.terminate();
            }
            clearTimeout( this._pingTimeout );
            clearTimeout( this._keepLive );
            this._wss = null;
            this._initWss();
        }
    };

    _initWss = () => {
        if ( !this._wss ) {
            this._wss = new WebSocket( this._wssHost );
            this._wss.on( "open", () => {
                this._onWebSocketOpen();
                emitter.emit( "sub_channel" );
                this._loopPing();
            } );

            this._wss.on( "close", () => {
                console.log( "close", e );
                this._delayReconnect();
            } );

            this._wss.on( "error", ( err ) => {
                console.log( "error", err );
                this._delayReconnect();
            } );

            this._wss.on( "ping", ( message ) => {
                console.log( "ping", message.toString() );
                this._heartbeat();
            } );

            this._wss.on( "pong", ( message ) => {
                console.log( "pong", message.toString() );
            } );

            this._wss.on( "message", ( message ) => {
                if ( !this._isArrMsg( message ) ) {
                    return;
                }
                let dataArr = JSON.parse( message );
                for ( const data of dataArr ) {
                    let channel = data.channel;
                    if ( !channel ) {
                        return;
                    }

                    if ( PrivateSubscription.CHANNEL_PREFIX === channel ) {
                        for ( let psub of Object.values( this._subscriptions ) ) {
                            let pdata = data.data;
                            if ( psub.belong( pdata ) ) {
                                psub.onMessage( pdata[psub.getDataName()] );
                                break;
                            }

                        }
                        continue;
                    }


                    let sub = this._subscriptions[channel];
                    if ( !sub ) {
                        continue;
                    }
                    sub.onMessage( data.data );
                }
            } );
        }
    };

    _getProxy = async ( path, param ) => {
        let res = await this._sendGet( path, param );
        this._checkState( res );
        return res;
    };

    _postProxy = async ( path, param ) => {
        let res = await this._sendPost( path, param );
        this._checkState( res );
        return res;
    };

    _postPublicProxy = async ( path, param ) => {
        let res = await this._sendPublicPost( path, param );
        this._checkState( res );
        return res;
    }

    _checkState = ( res ) => {
        if ( res.hasOwnProperty( "state" ) && res.state !== 0 )
            throw `Error (state:${ res.state }, message:${ res.msg })`;
    };

    _sendGet = async ( path, param ) => {
        try {
            return await got( this._url( path ), {
                searchParams: new URLSearchParams( param )
            } ).json();
        } catch ( error ) {
            console.log( error );
            throw error;
        }
    };

    _sendPost = async ( path, param ) => {
        try {
            let timestamp = Date.now();
            let strParam = JSON.stringify( param );
            let strToSign = '' + timestamp + strParam;
            let sign = this._buildSign( strToSign );

            return await got.post( this._url( path ), {
                json: param,
                headers: {
                    "bibox-api-key": this._apiKey,
                    "bibox-api-sign": sign,
                    "bibox-timestamp": timestamp
                }
            } ).json();
        } catch ( error ) {
            console.log( error );
            throw error;
        }
    };

    _sendPublicPost = async ( path, param ) => {
        try {
            return await got.post( this._url( path ), {
                json: param,
                headers: {
                    Referer: this._referer,
                    Origin: this._origin
                }
            } ).json();
        } catch ( error ) {
            console.log( error );
            throw error;
        }
    };
    _url = ( path ) => {
        return this._restHost + path;
    };

    _buildSign = ( strToSign ) => {
        return CryptoJS.HmacMD5( strToSign, this._secretKey ).toString();
    };

    _buildSubSign = () => {
        let strToSign = JSON.stringify( {
            "apikey": this._apiKey,
            "channel": PrivateSubscription.CHANNEL_PREFIX,
            "event": "addChannel",
        } );
        return CryptoJS.HmacMD5( strToSign, this._secretKey ).toString();
    };

    _isArrMsg = ( str ) => str.startsWith( "[" );

}

class BiboxCreditsClient extends BiboxCreditsClientBase {

    constructor( apiKey, secretKey ) {
        super( apiKey, secretKey );
    }

    /**
     * 获取kline
     * @param  symbol 币种名称
     * @param  interval 时间周期
     * @param  limit 条目限制
     */
    getCandlestick = async ( symbol, interval, limit ) => {
        let res = await this._getProxy( MarketUrl.CANDLESTICK, {
            "pair": symbol,
            "period": interval,
            "size": limit || 100
        } );
        return JsonUtil.candlestickWrapper( res.result );
    };

    /**
     * 获取深度
     * @param  symbol 交易对名称
     * @param  limit  条目限制
     */
    getOrderBook = async ( symbol, limit ) => {
        let res = await this._getProxy( MarketUrl.ORDER_BOOK, {
            "pair": symbol,
            "size": Number( limit ) || 200
        } );
        return JsonUtil.orderBookWrapper( res.result );
    };

    /**
     * 获取交易对
     */
    getCurrencyPairs = async () => {
        let res = await this._postPublicProxy( MarketUrl.CREDIT_LIST, {} );
        return JsonUtil.currencyPairsWrapper( res.result );
    }

    /**
     * 获取ticker
     * @param  symbol 交易对
     */
    getTicker = async ( symbol ) => {
        let res = await this._getProxy( MarketUrl.TICKER, {
            "pair": symbol,
        } );
        return JsonUtil.tickerWrapper( res.result );
    }

    /**
     * 获取公开成交记录
     * @param symbol 交易对
     * @param limit  数量限制
     */
    getTrades = async ( symbol, limit ) => {
        let res = await this._getProxy( MarketUrl.DEALS, {
            "pair": symbol,
            "size": Number( limit ) || 200
        } );
        return JsonUtil.tradeWrapper( res.result );
    }

    /**
     * 从钱包转进杠杆(信用交易)
     * @param asset    划转币种
     * @param amount   数量
     * @param position 仓位 EOS_USDT,BTC_USDT, *_USDT...
     */
    transferIn = async ( asset, amount, position ) => {
        await this._postProxy( PrivateUrl.TRANSFER_CREDIT, {
            "amount": amount,
            "coin_symbol": asset,
            "pair": position
        } );
    }

    /**
     * 从杠杆(信用交易)转进钱包
     * @param asset    划转币种
     * @param amount   数量
     * @param position 仓位 EOS_USDT,BTC_USDT, *_USDT...
     */
    transferOut = async ( asset, amount, position ) => {
        await this._postProxy( PrivateUrl.TRANSFER_CREDIT_TO_MAIN, {
            "amount": amount,
            "coin_symbol": asset,
            "pair": position
        } );
    }

    /**
     * 提现
     * @param symbol    提现币种
     * @param amount    提现数量
     * @param address   提现地址
     * @param memo      memo
     */
    withdraw = async ( symbol, amount, address, memo ) => {
        await this._postProxy( PrivateUrl.WITHDRAW, {
            "coin_symbol": symbol,
            "amount": Number( amount ),
            "addr": address,
            "memo": memo || undefined
        } );
    }

    /**
     * 提交委限价托单
     * @param symbol        交易对名称
     * @param quantity      下单数量
     * @param price         下单价格
     * @param tradeSide     交易方向
     * @param marginMode    仓位模式 全仓/逐仓
     */
    placeLimitOrder = async ( { symbol, quantity, price, tradeSide, marginMode } = {} ) => {
        let res = await this._postProxy( PrivateUrl.PLACE_ORDER, {
            "account_type": ApiMarginMode[marginMode],
            "pair": symbol,
            "amount": Number( quantity ),
            "price": Number( price ),
            "order_side": ApiTradeSide[tradeSide],
            "order_type": 2,
        } );
        return res.result.id;
    }

    /**
     * 借款
     * @param asset     资产名称
     * @param amount    数量
     * @param position  仓位 EOS_USDT,BTC_USDT, *_USDT...
     */
    borrow = async ( asset, amount, position ) => {
        await this._postProxy( PrivateUrl.BORROW, {
            "coin_symbol": asset,
            "amount": Number( amount ),
            "pair": position
        } );
    }

    /**
     * 还款
     * @param asset    币种
     * @param amount   数量
     * @param position 仓位 EOS_USDT,BTC_USDT, *_USDT...
     */
    repay = async ( asset, amount, position ) => {
        await this._postProxy( PrivateUrl.REFUND, {
            "coin_symbol": asset,
            "amount": Number( amount ),
            "pair": position
        } );
    }

    /**
     * 撤销委托单
     * @param orderId 订单id
     */
    cancelOrder = async ( orderId ) => {
        await this._postProxy( PrivateUrl.CANCEL_ORDER, {
            "orders_id": orderId.toString(),
        } );
    }

    /**
     * 获取指定仓位的获取借款资产信息
     */
    getPosition = async ( symbol ) => {
        let res = await this._postProxy( PrivateUrl.BORROWER_ASSET, {
            "pair": symbol
        } );
        return JsonUtil.positionWrapper( res.result );
    }

    /**
     * 查询钱包账户资产
     */
    getMainAccounts = async () => {
        let res = await this._postProxy( PrivateUrl.MAIN_ACCOUNT, {
            "select": 1
        } );
        return Object.values( JsonUtil.accountsWrapper( res.result ) );
    }

    /**
     * 查询钱包账户资产
     * @param symbol 币种
     */
    getMainAccount = async ( symbol ) => {
        let res = await this._postProxy( PrivateUrl.MAIN_ACCOUNT, {
            "select": 1
        } );
        return JsonUtil.accountsWrapper( res.result )[symbol];
    }

    /**
     * 获取全部币种的配置
     */
    getAssetInfos = async () => {
        let res = await this._postProxy( PrivateUrl.COIN_CONFIG, {} );
        return JsonUtil.assetInfosWrapper( res.result );
    }

    /**
     * 获取指定的币种的配置
     * @param symbol 币种
     */
    getAssetInfo = async ( symbol ) => {
        let res = await this._postProxy( PrivateUrl.COIN_CONFIG, {
            "coin_symbol": symbol
        } );
        return JsonUtil.assetInfosWrapper( res.result )[0];
    }

    /**
     * 获取指定币种充值地址
     * @param symbol 币种
     */
    getDepositAddress = async ( symbol ) => {
        let res = await this._postProxy( PrivateUrl.GET_DEPOSIT_ADDR, {
            "coin_symbol": symbol
        } );
        return res.result;
    }

    /**
     * 获取充值记录
     * @param depositStatus  充值状态
     * @param symbol  币种
     * @param page    页数
     * @param size    每页数量
     */
    getDepositEntries = async ( depositStatus, symbol, page, size ) => {
        let res = await this._postProxy( PrivateUrl.DEPOSIT_ENTRIES, {
            "coin_symbol": symbol || undefined,
            "page": page || 1,
            "size": size || 10,
            "filter_type": ApiDepositStatus[depositStatus] || undefined
        } );
        return JsonUtil.depositEntriesWrapper( res.result );
    }

    /**
     * 获取提现记录
     * @param symbol  币种
     * @param page    页数
     * @param size    每页数量
     */
    getWithdrawEntries = async ( symbol, page, size ) => {
        let res = await this._postProxy( PrivateUrl.URL_WITHDRAW_ENTRIES, {
            "coin_symbol": symbol || undefined,
            "page": page || 1,
            "size": size || 10,
        } );
        return JsonUtil.withdrawEntriesWrapper( res.result );
    }

    /**
     * 获取现货的账单
     * @param start     开始时间
     * @param end       结束时间
     * @param billType  类型
     * @param page      页码
     * @param size      条目数
     */
    getBills = async ( start, end, billType, page, size ) => {
        let res = await this._postProxy( PrivateUrl.BILLS, {
            "type": ApiBillType[billType],
            "begin_time": start || undefined,
            "end_time": end || undefined,
            "page": Number( page ) || 1,
            "size": Number( size ) || 10,
            "account_type": 1,
            "coin_id": ""
        } );
        return JsonUtil.billsWrapper( res.result );
    }

    /**
     * 获取交易详情
     * @param base        交易币种
     * @param quote       计价币种
     * @param tradeSide   交易方向
     * @param page        页码
     * @param size        条目数
     */
    getFills = async ( base, quote, tradeSide, page, size ) => {
        let res = await this._postProxy( PrivateUrl.TRADES_HISTORY, {
            "account_type": 1,
            "page": Number( page ) || 1,
            "size": Number( size ) || 10,
            "coin_symbol": base || undefined,
            "currency_symbol": quote || undefined,
            "order_side": ApiTradeSide[tradeSide]
        } );
        return JsonUtil.fillsWrapper( res.result );
    }

    /**
     * 根据订单id获取交易详情
     * @param orderId  订单id
     */
    getFillsById = async ( orderId ) => {
        let res = await this._postProxy( PrivateUrl.TRADES, {
            "account_type": 1,
            "id": orderId.toString()
        } );
        return JsonUtil.fillsByIdWrapper( res.result );
    }

    /**
     * 获取委托单
     * @param id 委托id或者用户自定义id
     */
    getOrder = async ( id ) => {
        let res = await this._postProxy( PrivateUrl.URL_ORDER_DETAIL, {
            "account_type": 1,
            "id": id.toString(),
        } );
        return JsonUtil.orderWrapper( res.result );
    };

    /**
     * 获取当前委托单
     * @param base         交易币种
     * @param quote        计价币种
     * @param tradeSide    交易方向
     * @param page         页码
     * @param size         条目数
     */
    getOpenOrders = async ( base, quote, tradeSide, page, size ) => {
        let res = await this._postProxy( PrivateUrl.ORDER_PENDING_LIST, {
            "account_type": 1,
            "page": page || 1,
            "size": size || 10,
            "coin_symbol": base || undefined,
            "currency_symbol": quote || undefined,
            "oder_side": ApiTradeSide[tradeSide]
        } );
        return JsonUtil.ordersWrapper( res.result );
    };

    /**
     * 获取历史委托单
     * @param base         交易币种
     * @param quote        计价币种
     * @param tradeSide    交易方向
     * @param page         页码
     * @param size         条目数
     */
    getClosedOrders = async ( base, quote, tradeSide, page, size ) => {
        let res = await this._postProxy( PrivateUrl.ORDER_HISTORY_LIST, {
            "account_type": 1,
            "page": page || 1,
            "size": size || 10,
            "coin_symbol": base || undefined,
            "currency_symbol": quote || undefined,
            "oder_side": ApiTradeSide[tradeSide]
        } );
        return JsonUtil.ordersWrapper( res.result );
    };

    /**
     * 订阅kline
     * @param {string} symbol 交易对名称
     * @param {string} interval 时间周期
     * @param listener
     */
    subscribeCandlestick = ( symbol, interval, listener ) => {
        this._subscribe( new CandlestickSubscription( symbol, interval, listener ) );
    };

    /**
     * 取消订阅kline
     * @param {string} symbol 交易对名称
     * @param {string} interval 时间周期
     */
    unsubscribeCandlestick = ( symbol, interval ) => {
        this._unsubscribe( CandlestickSubscription.buildChannelName( symbol, interval ) );
    };

    /**
     * 订阅深度
     * @param {string} symbol 交易对名称
     * @param listener
     */
    subscribeOrderBook = ( symbol, listener ) => {
        this._subscribe( new OrderBookSubscription( symbol, listener ) );
    };

    /**
     * 取消订阅深度
     * @param {string} symbol 交易对名称
     */
    unsubscribeOrderBook = ( symbol ) => {
        this._unsubscribe( OrderBookSubscription.buildChannelName( symbol ) );
    };

    /**
     * 订阅市场成交记录
     * @param {string} symbol 交易对名称
     * @param listener
     */
    subscribeTrade = ( symbol, listener ) => {
        this._subscribe( new TradeSubscription( symbol, listener ) );
    };

    /**
     * 取消订阅深度
     * @param {string} symbol 交易对名称
     */
    unsubscribeTrade = ( symbol ) => {
        this._unsubscribe( TradeSubscription.buildChannelName( symbol ) );
    };

    /**
     * 订阅指定的Ticker数据
     * @param {string} symbol 交易对名称
     * @param listener
     */
    subscribeTicker = ( symbol, listener ) => {
        this._subscribe( new TickerSubscription( symbol, listener ) );
    };

    /**
     * 取消订阅指定交易对的Ticker数据
     * @param {string} symbol 交易对名称
     */
    unsubscribeTicker = ( symbol ) => {
        this._unsubscribe( TickerSubscription.buildChannelName( symbol ) );
    };

    /**
     * 订阅与委托相关的信息
     */
    subscribeOrder = ( listener ) => {
        this._subscribe( new OrderSubscription( this, listener ) );
    };

    /**
     * 订阅用户数据解析成交明细
     */
    subscribeFill = ( listener ) => {
        this._subscribe( new FillSubscription( this, listener ) );
    };

    /**
     * 取消全部对用户数据的订阅
     */
    unsubscribePrivateChannel = () => {
        this._unsubscribeAllPrivateSubscriptions();
    };

}

class Subscription {

    constructor( listener ) {
        this._listener = listener;
        this._notified = false;
    }

    _decode = ( data ) => {
        console.log( data );
        throw "Not implemented";
    };

    _onData = ( data ) => {
        console.log( data );
        throw "Not implemented";
    };

    _getData = () => {
        throw "Not implemented";
    };

    onMessage = ( msg ) => {
        let obj = this._decode( msg );
        this._onData( obj );
        this._notifyUpdate();
    };

    _notifyUpdate = () => {
        if ( this._notified ) return;
        this._notified = true;
        setImmediate( () => {
            this._listener( this._getData() );
            this._notified = false;
        } );
    };

}

class CandlestickSubscription extends Subscription {

    constructor( symbol, interval, listener ) {
        super( listener );
        this._symbol = symbol;
        this._interval = interval;
        this._data = [];
    }

    _decode = ( objzip ) => {
        let obj = JsonUtil.unzip( objzip );
        return JsonUtil.candlestickWrapper( obj );
    };

    _onData = ( data ) => {
        this._data.push( ...data );
    };

    _getData = () => {
        let data = JSON.parse( JSON.stringify( this._data ) );
        this._data = [];
        return data;
    };

    static buildChannelName = ( symbol, interval ) => {
        return `bibox_sub_spot_${ symbol }_kline_${ interval }`;
    };

    getChannel = () => {
        return CandlestickSubscription.buildChannelName( this._symbol, this._interval );
    };

    toString() {
        return JSON.stringify( {
            event: 'addChannel',
            channel: this.getChannel(),
            binary: 0,
            ver: 0,
        } );
    }

}

class OrderBookSubscription extends Subscription {

    constructor( symbol, listener ) {
        super( listener );
        this._symbol = symbol;
        this._data = {};
        this._asks = {};
        this._bids = {};
    }

    _decode = ( objzip ) => {
        let obj = JsonUtil.unzip( objzip );
        if ( !obj.hasOwnProperty( "add" ) ) {
            this._data = JsonUtil.orderBookWrapper( obj );
            this._asks = this._data.asks.reduce( ( res, item ) => {
                res[item.price] = item;
                return res;
            }, {} );
            this._bids = this._data.bids.reduce( ( res, item ) => {
                res[item.price] = item;
                return res;
            }, {} );
        } else {
            if ( obj.add.asks ) {
                obj.add.asks.forEach( item => {
                    this._asks[item.price] = { price: item.price, amount: item.volume };
                } );
            }
            if ( obj.add.bids ) {
                obj.add.bids.forEach( item => {
                    this._bids[item.price] = { price: item.price, amount: item.volume };
                } );
            }
            if ( obj.del.asks ) {
                obj.del.asks.forEach( item => {
                    delete this._asks[item.price];
                } );
            }
            if ( obj.del.bids ) {
                obj.del.bids.forEach( item => {
                    delete this._bids[item.price];
                } );
            }
            if ( obj.mod.asks ) {
                obj.mod.asks.forEach( item => {
                    this._asks[item.price] = { price: item.price, amount: item.volume };
                } );
            }
            if ( obj.mod.bids ) {
                obj.mod.bids.forEach( item => {
                    this._bids[item.price] = { price: item.price, amount: item.volume };
                } );
            }
            this._data.updateTime = obj.updateTime;

            this._data.asks = Object.values( this._asks ).sort( ( f, b ) => f.price - b.price );
            this._data.bids = Object.values( this._bids ).sort( ( f, b ) => b.price - f.price );
        }

        return this._data;
    };

    _onData = () => {
        // do nothing
    };

    _getData = () => {
        return JSON.parse( JSON.stringify( this._data ) );
    };

    static buildChannelName = ( symbol ) => {
        return `bibox_sub_spot_${ symbol }_depth`;
    };

    getChannel = () => {
        return OrderBookSubscription.buildChannelName( this._symbol );
    };

    toString() {
        return JSON.stringify( {
            event: 'addChannel',
            channel: this.getChannel(),
            binary: 0,
            ver: 0,
        } );
    }

}

class TradeSubscription extends Subscription {

    constructor( symbol, listener ) {
        super( listener );
        this._symbol = symbol;
        this._data = [];
    }

    _decode = ( objzip ) => {
        let obj = JsonUtil.unzip( objzip );
        return JsonUtil.tradeWrapper( obj );
    };

    _onData = ( data ) => {
        this._data.push( ...data );
    };

    _getData = () => {
        let data = JSON.parse( JSON.stringify( this._data ) );
        this._data = [];
        return data;
    };

    static buildChannelName = ( symbol ) => {
        return `bibox_sub_spot_${ symbol }_deals`;
    };

    getChannel = () => {
        return TradeSubscription.buildChannelName( this._symbol );
    };

    toString() {
        return JSON.stringify( {
            event: 'addChannel',
            channel: this.getChannel(),
            binary: 0,
            ver: 8
        } );
    }

}

class TickerSubscription extends Subscription {

    constructor( symbol, listener ) {
        super( listener );
        this._symbol = symbol;
        this._data = {};
    }

    _decode = ( obj ) => {
        return JsonUtil.tickerWrapper( obj );
    };

    _onData = ( data ) => {
        this._data = data;
    };

    _getData = () => {
        return this._data;
    };

    static buildChannelName = ( symbol ) => {
        return `bibox_sub_spot_${ symbol }_ticker`;
    };

    getChannel = () => {
        return TickerSubscription.buildChannelName( this._symbol );
    };

    toString() {
        return JSON.stringify( {
            event: 'addChannel',
            channel: this.getChannel(),
            binary: 0,
        } );
    }

}

class PrivateSubscription extends Subscription {

    static CHANNEL_PREFIX = "bibox_sub_spot_ALL_ALL_login"

    constructor( client, listener ) {
        super( listener );
        this._client = client;
    }

    belong = () => {
    }

    getDataName = () => {
    };

    getChannel = () => {
        return PrivateSubscription.CHANNEL_PREFIX + this.getDataName();
    };

    toString() {
        return JSON.stringify( {
            "apikey": this._client._apiKey,
            "channel": PrivateSubscription.CHANNEL_PREFIX,
            "event": "addChannel",
            "sign": this._client._buildSubSign()
        } );
    }

}

class FillSubscription extends PrivateSubscription {

    constructor( client, listener ) {
        super( client, listener );
        this._data = [];
    }

    _decode = ( obj ) => {
        return JsonUtil.fillEventWrapper( obj );
    };

    _onData = ( data ) => {
        this._data.push( data );
    };

    _getData = () => {
        let data = JSON.parse( JSON.stringify( this._data ) );
        this._data = [];
        return data;
    };

    getDataName = () => {
        return "history";
    };

    belong = ( obj ) => {
        if ( obj.hasOwnProperty( this.getDataName() ) ) {
            return obj[this.getDataName()].account_type > 0;
        }
        return false;
    }

}

class OrderSubscription extends PrivateSubscription {

    constructor( client, listener ) {
        super( client, listener );
        this._data = {};
    }

    _decode = ( obj ) => {
        return JsonUtil.orderEventWrapper( obj );
    };

    _onData = ( data ) => {
        this._data[data.orderId] = data;
    };

    _getData = () => {
        let data = JSON.parse( JSON.stringify( this._data ) );
        this._data = {};
        return data;
    };

    getDataName = () => {
        return "orderpending";
    };

    belong = ( obj ) => {
        if ( obj.hasOwnProperty( this.getDataName() ) ) {
            return obj[this.getDataName()].account_type > 0;
        }
        return false;
    }

}

class JsonUtil {

    static unzip = ( objzip ) => {
        let buf = zlib.unzipSync( Buffer.from( objzip, "base64" ) ).toString();
        return JSON.parse( buf );
    };

    static candlestickWrapper = ( obj ) => {
        return obj.map( item => {
            return {
                time: item.time,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.vol
            };
        } );
    };

    static orderBookWrapper = ( obj ) => {
        let json = {
            symbol: obj.pair,
            updateTime: obj.update_time,
            asks: [],
            bids: []
        };
        json.asks = obj.asks.map( item => {
            return {
                price: item.price,
                amount: item.volume,
            };
        } );
        json.bids = obj.bids.map( item => {
            return {
                price: item.price,
                amount: item.volume,
            };
        } );
        return json;
    };

    static currencyPairsWrapper = ( obj ) => {
        return obj.map( item => {
            return {
                id: item.id,
                symbol: item.pair,
                isolated : {
                    maxLeverage:item.isolated_leverage,
                    enabled:!!item.is_isolated
                },
                cross: {
                    maxLeverage:item.isolated_leverage,
                    enabled:!!item.is_cross
                }
            };
        } );
    };

    static accountsWrapper = ( obj ) => {
        return obj.assets_list.reduce( ( x, item ) => {
            x[item.coin_symbol] = {
                asset: item.coin_symbol,
                available: item.balance,
                freeze: item.freeze
            };
            return x;
        }, {} );
    };

    static positionWrapper = ( obj ) => {
        return {
            symbol: obj.pair,
            available: obj.currency_deposit,
            loan: obj.currency_borrow,
            borrowingLimit: obj.currency_can_borrow,
            currentMargin: new BigNumber( obj.margin_radio ).div( 100 ).toString(),
            maxLeverage: obj.max_leverage_ratio,
            currentLeverage: obj.current_leverage_radio,
            liquidationPrice: obj.force_price,
            maintenanceMargin: new BigNumber( obj.force_deal_radio ).div( 100 ).toString(),
            assets: obj.items.map( item => {
                return {
                    asset: item.coin_symbol,
                    available: item.balance,
                    borrow: item.borrow,
                    freeze: item.freeze,
                    interest: item.interest
                };
            } )
        };

    };

    static assetInfosWrapper = ( obj ) => {
        return obj.map( item => {
            return {
                symbol: item.coin_symbol,
                precision: item.original_decimals,
                depositEnabled: !!item.enable_deposit,
                withdrawEnabled: !!item.enable_withdraw,
                withdrawalFee: item.withdraw_fee,
                minWithdraw: item.withdraw_min
            };
        } );
    };

    static depositEntriesWrapper = ( obj ) => {
        return {
            count: obj.count,
            page: obj.page,
            items: obj.items.map( item => {
                return {
                    symbol: item.coin_symbol,
                    address: item.to_address,
                    amount: item.amount,
                    confirmations: item.confirmCount,
                    time: item.createdAt,
                    status: ApiDepositStatus.fromInteger( item.status )
                };
            } )
        };
    };

    static withdrawEntriesWrapper = ( obj ) => {
        return {
            count: obj.count,
            page: obj.page,
            items: obj.items.map( item => {
                return {
                    symbol: item.coin_symbol,
                    address: item.to_address,
                    amount: item.amount,
                    fee: item.fee,
                    time: item.createdAt,
                    status: ApiWithDrawEntryStatus.fromInteger( item.status ),
                    memo: item.memo
                };
            } )
        };
    };

    static billsWrapper = ( obj ) => {
        return {
            count: obj.count,
            page: obj.page,
            items: obj.items.map( item => {
                return {
                    symbol: item.symbol,
                    time: new Date( item.createdAt ).getTime(),
                    change: item.change_amount,
                    result: item.result_amount,
                    type: ApiBillType.fromInteger( item.bill_type )
                };
            } )
        };
    };

    static fillsWrapper = ( obj ) => {
        return {
            count: obj.count,
            page: obj.page,
            items: obj.items.map( item => {
                return this.fillWrapper( item );
            } )
        };
    };

    static fillsByIdWrapper = ( obj ) => {
        return obj.orderList.map( item => {
            return this.fillWrapper( item );
        } );
    };

    static fillWrapper = ( item ) => {
        return {
            id: item.id,
            orderId: item.relay_id,
            symbol: item.coin_symbol + "_" + item.currency_symbol,
            tradeSide: ApiTradeSide.fromInteger( item.order_side ),
            price: item.price,
            quantity: item.amount,
            isMaker: !!item.is_maker,
            time: item.createdAt,
            fee: {
                value: item.fee,
                symbol: item.fee_symbol,
                payInBIX: !!item.pay_bix,
            },
        };
    }

    static orderWrapper = ( obj ) => {
        return {
            side: ApiTradeSide.fromInteger( obj.order_side ),
            quantity: obj.amount,
            price: obj.price,
            createTime: obj.createdAt,
            executedQty: obj.deal_amount,
            orderId: obj.id,
            status: ApiOrderStatus.fromInteger( obj.status ),
            symbol: obj.coin_symbol + "_" + obj.currency_symbol
        };
    };

    static ordersWrapper = ( obj ) => {
        return {
            count: obj.count,
            page: obj.page,
            items: obj.items.map( item => {
                return this.orderWrapper( item );
            } )
        };
    };

    static tradeWrapper = ( obj ) => {
        return obj.map( item => {
            return {
                symbol: item.pair,
                side: ApiTradeSide.fromInteger( item.side ),
                price: item.price,
                quantity: item.amount,
                time: item.time
            };
        } );
    };

    static tickerWrapper = ( obj ) => {
        return {
            symbol: obj.pair,
            change: obj.percent,
            time: obj.timestamp,
            volume: obj.vol,
            price: obj.last,
            priceInCNY: obj.base_last_cny,
            priceInUSD: obj.last_usd,
            high: obj.high,
            low: obj.low,
            bestAskPrice: obj.sell,
            bestAskQty: obj.sell_amount,
            bestBidPrice: obj.buy,
            bestBidQty: obj.buy_amount
        };
    };

    static fillEventWrapper = ( obj ) => {
        return this.fillWrapper( obj );
    };

    static accountEventWrapper = ( obj ) => {
        let data = obj.normal;
        return Object.keys( data ).map( key => {
            return {
                asset: key,
                available: data[key].balance,
                freeze: data[key].freeze
            };
        } );
    };

    static orderEventWrapper = ( obj ) => {
        return {
            orderId: obj.oi,
            clientOrderId: obj.coi,
            symbol: obj.pi,
            orderMargin: obj.fz,
            createTime: obj.t,
            userId: obj.ui,
            failReason: obj.r,
            quantity: obj.q,
            price: obj.p,
            executedQty: obj.eq,
            avgPrice: obj.dp,
            action: ApiTradeAction.fromOrderSide( obj.sd ),
            side: ApiTradeSide.fromOrderSide( obj.sd ),
            status: ApiOrderStatus.fromInteger( obj.s ),
            fee: {
                value: obj.f,
                inBix: obj.fb,
                inCoupon: obj.fb0,
            },
        };
    };

}

module.exports = {
    BiboxCreditsClient, TimeInterval, TradeSide, MarginMode,
    OrderStatus, BillType, DepositStatus
};
