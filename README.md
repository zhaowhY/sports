# 体育赛事管理系统 - 西电大三综合设计作业

## 相关连接
- [项目在线链接](http://39.105.108.226:7001)
- [项目仓库地址]()
- [体育赛事管理系统的设计与实现设计文档](https://cnphkngr8e.feishu.cn/file/boxcnb2B5V2LAJjrX6P77cPuItg)
- [接口文档链接](http://note.youdao.com/noteshare?id=f691c1b7400922f6abb96fefc81aad54)
- [项目数据库sql文件](./sports-backend/sports.sql)

## 项目步骤
1. 在数据库中运行sql文件（sports.sql）

**后端代码sports-backend中**
2. 在`config.local`中配置数据库连接账号密码
3. 执行下列命令
``` bash
# install dependencies（安装依赖包）
npm install

# dev with hot reload at localhost:7001 （启动开发环境服务）
npm run dev

# prod with hot reload at localhost:7001 （启动正式环境服务）
npm run start

# stop the serve （停止正式环境服务）
npm run stop
```

**前端代码sports-web中**
4. 前端代码`.env`中配置后端启动的接口url(http://127.0.0.1:7001)
5. 执行下列命令
``` bash
# install dependencies(安装依赖)
npm install

# serve with hot reload at localhost:8080(启动服务)
npm start
```

## 默认账号
- 操作员 operator/123
- 管理员 admin/123