import {Payment} from 'wechat-pay';
import {base, conf} from "bun-sun";
import {users} from "./users.ts";

export class order extends base {
    uid:number
    status:number
    total:number
    spu:any //订单商品信息不可更改所有嵌套存储，避免联查
    time:Date
    async createOrder() {
        await super.post()
        const payment = new Payment({partnerKey: conf.wx.key, appId: conf.wx.appid, mchId: conf.wx.mchid, notifyUrl: conf.wx.cb,});
        const result = await payment.getBrandWCPayRequestParams({
            body: "fdsf",
            out_trade_no: `${this.id}`,  // 商户订单号，唯一
            total_fee: this.total,                      // 订单金额（单位为分）
            spbill_create_ip: '123.12.12.123', // 终端IP
            notify_url: conf.wx.cb,   // 通知地址
            trade_type: 'JSAPI',            // 交易类型，JSAPI为小程序支付
            openid: await new users().get({id:this.uid})['openid'],//前端传uid，uid数据库查出openid
        });
        console.log(result);
    }
    async cb(req) {
    //修改订单状态
        return 'hello world'
    }
}
