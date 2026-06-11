# 微剧场 - 影视影剧发布平台

一个现代化的影视影剧展示和分享平台，基于 Next.js + Neon 数据库构建，支持管理后台和 Vercel 一键部署。

## 功能特性

- 精美影院风格设计，沉浸式体验
- 完全响应式，支持桌面和移动端
- 支持夸克/百度/阿里云盘等多平台资源链接
- 管理后台，支持添加/编辑/删除剧集
- 单个剧集分享功能，支持微信 Open Graph 预览
- 首页精选推荐
- 标签系统（新上线、热播、豆瓣9分等）
- Neon Serverless PostgreSQL 数据库
- WebP/AVIF 图片格式支持
- Next.js + Vercel 一键部署

## 快速开始

### 环境变量配置

复制 `.env.example` 为 `.env.local`，填入 Neon 数据库连接字符串：

```bash
# Neon 数据库连接（Pooled，用于应用连接）
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require

# Neon 数据库连接（Unpooled，用于直连）
DATABASE_URL_UNPOOLED=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

首次访问时，数据库会自动创建表并插入默认数据。

### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 导入项目
3. 在 Vercel 项目设置中添加环境变量 `DATABASE_URL`
4. 部署后自动运行

## 项目结构

```
/
├── app/
│   ├── api/
│   │   ├── dramas/
│   │   │   ├── route.js           # 剧集列表 API (GET/POST)
│   │   │   └── [id]/route.js      # 单个剧集 API (GET/PUT/DELETE)
│   │   ├── health/route.js        # 数据库健康检查
│   │   └── init-db/route.js       # 数据库初始化
│   ├── admin/
│   │   └── page.js                # 管理后台页面
│   ├── drama/
│   │   └── [id]/
│   │       ├── page.js            # 剧集详情页（服务端，含 OG meta）
│   │       └── DramaDetailClient.js  # 剧集详情交互组件
│   ├── page.js                    # 首页
│   ├── layout.js                  # 根布局（含 OG meta）
│   └── globals.css                # 全局样式
├── lib/
│   └── db-neon.js                 # Neon 数据库操作模块
├── .env.example                   # 环境变量模板
├── next.config.js                 # Next.js 配置（图片域名、WebP）
└── package.json
```

## 使用说明

### 访问首页

- 打开首页即可看到所有剧集列表，包含海报、剧名、简介和网盘链接
- 点击剧集卡片进入详情页
- 详情页支持获取网盘链接和分享给好友

### 管理后台

访问 `/admin` 进入管理后台：

- **添加剧集**：点击「添加新剧集」按钮，填写剧集信息
- **编辑剧集**：点击「编辑」按钮修改现有剧集
- **删除剧集**：点击「删除」按钮删除剧集
- **设为推荐**：编辑时勾选「设为首页推荐」可将剧集设为 Hero 区展示

### 剧集信息字段

| 字段 | 说明 | 必填 |
|------|------|------|
| 剧名 | 剧集名称 | 是 |
| 简介 | 剧情简介 | 是 |
| 海报 | 海报图片链接 | 是 |
| 集数 | 总集数 | 否 |
| 年份 | 年份 | 否 |
| 类型 | 剧集类型（如：悬疑都市） | 否 |
| 标签 | 特殊标签（如：新剧） | 否 |
| 资源链接 | 网盘链接 | 否 |
| 网盘类型 | 夸克/百度/阿里 | 否 |
| 画质 | HD/1080P/4K | 否 |

### 微信分享

分享剧集详情页链接到微信时，会自动显示剧集标题、简介和海报图片（通过 Open Graph meta 标签实现）。

### 健康检查

访问 `/api/health` 可检查数据库连接状态。

## 技术栈

- **框架**：Next.js 14 (App Router)
- **数据库**：Neon Serverless PostgreSQL
- **数据库驱动**：@neondatabase/serverless (HTTP)
- **样式**：CSS-in-JS
- **图片**：Next/Image（支持 WebP/AVIF）
- **部署**：Vercel

## 许可证

MIT
