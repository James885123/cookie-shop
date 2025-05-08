# 乔乐曲奇饼干网上商店

这是乔乐曲奇饼干的电子商务网站，支持商品展示、购物车、下单和订单管理功能。

## 功能特点

- 响应式设计，适配移动端和桌面端
- 多语言支持（中文和英文）
- 产品展示和购物车功能
- 支持多种支付方式
- 订单管理系统

## 安装说明

1. 将项目文件复制到您的Web服务器根目录（如：Apache的htdocs目录）

2. 创建MySQL数据库
   - 打开MySQL Workbench或其他数据库管理工具
   - 复制并执行`db/orders.sql`中的SQL脚本创建数据库和表

3. 配置数据库连接
   - 打开`js/process-order.php`文件
   - 编辑以下配置以匹配您的MySQL设置：
     ```php
     $servername = "localhost";
     $username = "root";  // 修改为您的MySQL用户名
     $password = "";      // 修改为您的MySQL密码
     $dbname = "cookie_shop";
     ```

4. 配置管理员账号
   - 打开`admin/login.php`文件
   - 修改管理员用户名和密码：
     ```php
     $admin_username = 'admin';
     $admin_password = 'cookie2025';  // 建议使用更强密码
     ```

## 使用方法

1. 访问网站首页：`http://您的域名/cookie/`

2. 管理订单：
   - 访问 `http://您的域名/cookie/admin/login.php`
   - 使用管理员账号登录
   - 查看所有订单并管理订单状态

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：PHP
- 数据库：MySQL

## 文件结构

```
cookie/
├── index.html            # 网站首页
├── css/                  # 样式文件
│   └── style.css
├── js/                   # JavaScript文件
│   ├── script.js         # 主要功能脚本
│   ├── translations.js   # 多语言翻译文件
│   ├── language-switcher.js # 语言切换功能
│   └── process-order.php # 处理订单的PHP脚本
├── img/                  # 图片资源
├── db/                   # 数据库相关文件
│   └── orders.sql        # 数据库创建脚本
└── admin/                # 管理员后台
    ├── login.php         # 登录页面
    ├── logout.php        # 退出登录
    └── order-manager.php # 订单管理页面
```

## 注意事项

- 请确保您的服务器已安装PHP 7.0或更高版本
- 请确保PHP已启用mysqli扩展
- 确保网站目录有适当的读写权限

## 管理员账号

默认管理员账号信息：
- 用户名：admin
- 密码：cookie2025

首次登录后请立即修改默认密码！

## 自定义

- 在`index.html`中修改产品信息、联系方式等内容
- 在`css/style.css`中调整颜色、布局等样式
- 在`js/script.js`中添加或修改交互功能

## 需要的图片

为了使网站正常显示，您需要添加以下图片到`img`目录：

1. `cookie1.jpg`, `cookie2.jpg`, `cookie3.jpg`, `cookie4.jpg` - 各种曲奇产品的图片
2. `bakery.jpg` - 烘焙坊或工作室的图片
3. `hero-bg.jpg` - 首页顶部大图背景

## 注意事项

- 所有图片建议使用相同的尺寸以保持网站美观
- 产品图片建议使用16:9或4:3的比例
- 所有示例联系信息需要替换为您的实际联系方式 