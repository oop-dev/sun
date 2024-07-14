import sql, {base, conf, jwtToken} from "bun-sun";

// 子类 Dog 继承自 Animal
export class users extends base{
    name: string
    pwd:string
    openid:string
    phone:number
    async test1() {
        return "hello world"
    }
    async login({code,sign}) {
        if (sign){//验证码登录

        }else if (code){//小程序登录
           let rsp=await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${conf.wx.appid}&secret=${conf.wx.secret}&js_code=${code}&grant_type=authorization_code`);
            let json=await rsp.json()
            console.log(json)
            if (json.errmsg)throw json.errmsg
            this.openid=json.openid
            await super.post()
            return {uid:this.id,name:this.name,token:await jwtToken({uid:this.id})}
        }else {
            if (!this.name||!this.pwd) throw "用户名或密码空"
            let pwd=this.pwd
            await super.getNullAble(sql`name=${this.name}`)
            if (!this.id)throw "用户已未注册"
            if (!await Bun.password.verify(pwd, this.pwd))throw "用户名密码错误"
            return {uid:this.id,name:this.name,token:await jwtToken({uid:this.id})}
        }
    }
    async register() {
        if (!this.name||!this.pwd) throw "用户名或密码空"
        await super.getNullAble(sql`name=${this.name}`)
        if (this.id)throw "用户已存在"
        console.log('=======this',this)
        this.pwd= await Bun.password.hash(this.pwd)
        await super.post()
        return {uid:this.id,name:this.name,token:await jwtToken({uid:this.id})}
    }
}

