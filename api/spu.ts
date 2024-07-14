import {base} from "bun-sun";

export class spu extends base {
    name:number
    img:string
    desc:string //订单商品信息不可更改所有嵌套存储，避免联查
    price:number
    list:any  //可作为课程list，也可作为属性，[{小碗:10,大碗:12},{三鲜:2,麻辣:3}]
    attr:any //[{小碗:10,大碗:12},{三鲜:2,麻辣:3}]
    //为实现接口，可以http sql访问商品列表和详情
}
