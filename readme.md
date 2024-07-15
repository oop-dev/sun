# Sun.js 教程 (Sun.js Tutorial)

## 介绍 (Introduction)
Sun.js 是一个 JavaScript 全栈 Web 和 ORM 后端框架，基于面向对象设计的全新路由方式。Sun.js 包含 HTTP、ORM、登录鉴权，微信支付，配置、日志、JWT、静态资源文件服务器等模块，可以快速开发，让程序员只专注业务。Sun.js 基于Bun.js 和 PostgreSQL 开发。

Sun.js is a comprehensive JavaScript full-stack web and ORM backend framework. It features a new routing method based on object-oriented design. Sun.js includes HTTP, ORM, configuration, logging, JWT, and static resource file server modules, enabling rapid development and allowing developers to focus solely on business logic. Sun.js is built on top of Bun.js and PostgreSQL.

## 目录
### 1.安装：安装sun.js
### 2.http api，面型对象实现http接口，
### 3.orm:orm操作数据库
### 4.http sql:前端直接操作数据库
### 5.登录鉴权插件：实现session，jwt，密码，验证码，微信登录，和登录拦截权限校验，详情看users.ts和conf.toml
### 6.商品支付插件：实现了商品列表，下单微信支付，配置appid，secret就集成微信支付和支付回调修改订单状态,详情看order.ts和conf.toml
### 7.文件服务器：默认开启文件服务PUT /public/test.png 上传文件，/public/test.png浏览文件，/public/test.png/1 下载文件


## 1.安装 (Installation)

### 安装 Bun运行时 (Install Bun.js)
#### Linux和Mac环境：
```bash
curl -fsSL https://bun.sh/install | bash
```
#### Windows环境：
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 使用sun.js (use sun.js)
```bash
bun add bun-sun
```

新建api文件，api目录下建users.ts,然后创建users类，创建任意属性，任意方法，返回hello+名称
```bash
或者拉去git 代码
git clone https://github.com/CodeEasyDev/sun.git    然后 bun install
```
``` js
export class users {
    name: string
    async test() {
        return `hello world`
    }
}
```

index.ts中导入run()，
``` js
import {run} from "bun-sun";
run()
```
### 启动程序
```bash
bun run index.ts
```
然后调用get http://localhost:3000/users/test
``` js
"hello 张三"
```
可以看到接口返回了"hello 张三"，
我们创建了一个类，然后什么都不用管，请求/users/get代表调用user对象的get方法，user.get()，
用面向对象的思想，巧妙的自动将路由转换成对象方法，users类有get，add方法，路径就为/users/get,/users/add


## 2.http api：
## get/delete请求：
### 请求方式： /user/get，/user.get, /user 三选一,http://localhost:3000/get，/users.get，/users/get
``` js
export class users {
    name: string
    async get() {//访问GET /users   前端收到"查询用户接口"
        return `查询用户接口` /users    
    }
    async del() {//访问DELETE /users   前端收到"删除用户接口"
        return `删除用户接口` / users    
    }   
    async login() {//访问GET /users/login   前端收到"hello world"
        return `login method` 
    }    
}
```
### qeury入参：user/get?name=张三
``` js
export class users {
    name: string
    async get(req) {//参数自动映射到this.name和req.name,二选一
        return `hello ${this.name},${req.name}` //前端收到"hello 张三"
    }
}
```
### param入参：user/get/张三
``` js
export class users {
    name: string
    async get(name) {//这里指定name，张三自动映射到name，或者自动映射this.name上
        return `hello ${this.name}` //前端收到"hello 张三"
    }
}
```

## post/put请求：
### 请求方式： user/post，user.post, /user 三选一
### json入参：{"name":"张三","age":18}
``` js
export class users {
    name: string
    age：number
    async post(req) {//json参数自动映射到req和this上面
        return `hello ${this.name}，${this.age}` //前端收到"hello 张三，18"
    }
}
```
## http操作：
### 获取请求响应： this.r,this.w ,this.r.headers,this.r.json 等等
### 跨越：默认开启
### 日志：默认打印请求，响应，和全局异常
### 异常：框架自动处理异常，异常后自动给前端返回错误消息

## 3.Orm介绍：
### 配置
conf.toml配置postgres数据库的连接
``` toml
[db]
dsn='postgres://postgres:root@localhost:5432/mydb'
```
### 使用：
继承base类自动拥有增删改查方法，post，del，put，get
``` js
export class users extends base{
    name: string
    age:number
    async get() {//访问 /users 前端自动获取数据库数据
        return await super.get()  //等效select * from users
    }    
}
```

## 增 post：
### 增加一条：/users/testAdd {"name":"张三","age":18}
``` js
export class users extends base{
    name: string
    age:number
    async testAdd(req) {//json自动绑定到this和req对象，二选一
        return await super.post()  //等效super.post(req)
    }    
}
```
### 增加多条：/users/testAdd [{"name":"张三","age":18},{"name":"李四","age":20}]
``` js
export class users extends base{
    name: string
    age:number
    async testAdd(list) {//json list自动绑定到this.list和list上，二选一
        return await super.post()  //等效super.post(list)
    }    
}
```
## 删 del：
### 单字段删除：/users/testDel/张三
``` js
export class users extends base{
    name: string
    age:number
    async testDel(name) {//json自动绑定到this.name和name，二选一
        return await super.del()  //super.del(name)等效,delete from users where name='张三'
    }    
}
```
### 动态删除：/users/testDel?id=1&name=张三   
``` js
export class users extends base{
    name: string
    age:number
    async testDel(where) {//根据参数个数自动动态删除
        return await super.del() //super.del(where)等效，delete from users where id=1 and name=张三 
    }    
}
```
### 条件删除：/users/testDel?id<100|name=张三  
这里涉及query sql，代表sql的条件，和sql写法一模一样，但是and or显得臃肿可以替换成&和|
``` js
export class users extends base{
    name: string
    age:number
    async testDel(where) {//json自动绑定到this和req对象，二选一
        return await super.del(where) //delete from users where id<100 or name=张三
    }    
}
```

## 改 put：
### 根据id修改：/users/testPut {"id":1,"age":18}
``` js
export class users extends base{
    name: string
    age:number
    async testPut(req) {//json自动绑定到this和req对象，二选一
        return await super.post()  //等效super.post(req)
    }    
}
```
### 动态修改：/users/testPut?id=1&name=张三   json：{"pwd":"1111","age":18}
``` js
export class users extends base{
    name: string
    age:number
    async testPut(where) {//根据参数个数自动动态修改
        return await super.put(where) //update users set pwd='1111',age=18 where id=1 and name='张三'
    }    
}
```
### 条件修改：/users/testPut?id<100|name=张三   json：{"pwd":"1111","age":18}
这里涉及query sql，代表sql的条件，和sql写法一模一样，但是and or显得臃肿可以替换成&和|

``` js
export class users extends base{
    name: string
    age:number
    async testPut(where) {//json自动绑定到this和req对象，二选一
        return await super.put(where) //update users set pwd='1111',age=18 where id<100 or name=张三
    }    
}
```

## 查 get：
### 单字段查询：/users/testGet/1
``` js
export class users extends base{
    name: string
    age:number
    async testDel(id) {//json自动绑定到this.name和name，二选一
        return await super.get()  //super.get(id)等效,select *  from users where name='张三'
    }    
}
```
### 动态查询：/users/testGet?id=1&name=张三
``` js
export class users extends base{
    name: string
    age:number
    async testDel(where) {//根据参数个数自动动态查询
        return await super.get() //super.get(where)等效，select *  from users where id=1 and name=张三 
    }    
}
```
### 条件查询：/users/testGet?id<100|name=张三
这里涉及query sql，代表sql的条件，和sql写法一模一样，但是and or显得臃肿可以替换成&和|
``` js
export class users extends base{
    name: string
    age:number
    async testGet(where) {
        return await super.get(where) //select * from users where id<100 or name=张三
    }    
}
```

## 4.http sql:
前端直接通过数据api操作数据库，实现敏捷开发
``` js
export class users extends base{ //继承base不需要写任何方法，前端直接调用get，post，del，update
    name: string
    age:number
}
```
### 增：
路径：POST /users 或者POST /users/post  json:{"name":"张三","age":18},教程和上述orm一样，
### 删：
路径：DELETE /users?id<100|name=张三, 或者POST /users/del?id<100|name=张三 ,教程和上述orm一样，
### 改：
路径：PUT /users?id<100|name=张三 ，或者 POST /users/put?id<100|name=张三  json:{"pwd":"1111","age":18},教程和上述orm一样，
### 查询接口：
路径：/users?id<100|name=张三, 或者/users/get?id<100|name=张三 ,教程和上述orm一样


## 双层架构，前端调用后端，后端api这层操作dao层数据，适合复杂业务逻辑
继承base，在user类里写方法，user是controller层，user的父类是dao层
``` js
export class users extends base{
    name: string
    async login() {//子类是controller层，处理登录的复杂逻辑，如参数校验，密码正确校验，生成jwtToken
        if (!this.name||!this.pwd) throw "用户名或密码错误"  
        await super.get()//父类是dao层super.get() 是父类dao层再操作数据库，查询失败会抛异常直接返回Not Found错误，因此不需要判断查询成功
        let jwtToken=await jwtToken({uid:this.id})//查询失败自动给前端返回Not Found，成功自动赋值到this，生成jwt
        return {uid:this.id,token:jwtToken} //给前端返回token，双层架构完成了复杂的逻辑处理，完成了登录功能
    }
}
```
查询接口，/users/get，或GET /users/id,
查询id为3用户，查列表get变为gets即可
``` js  
    {
        "id": 3,
    }
```
