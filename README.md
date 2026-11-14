# VidNest KY · 用户端前端演示

供软件开发学习、技术研究与二次开发参考的视频界面项目，从 VidNest 三端工程的用户端页面整理而来。采用 **MIT 许可证**，允许使用、修改、分发和商业使用代码，须保留版权与许可声明。代码许可不免除实际运营所需的内容授权、资质与合规义务。

本仓库只有用户端源码和静态构建配置，不包含 Django 后端、管理后台、代理后台、数据库、真实业务数据、生产配置或原项目 Git 历史。

## 安装、运行与打包

要求 Node.js 24 或更高版本及 npm。

```bash
npm ci
npm run dev
```

开发访问 http://localhost:3000 。

```bash
npm run audit:public
npm run typecheck
npm run build:web
npm run preview
```

`build:web` 与 `build` 等价，仅构建用户端，产物位于 `out/`。`preview` 默认使用 http://localhost:4173 。将 **out 目录内容**部署到静态站点根目录即可，不需要 Python、数据库或 Node 业务服务器。不要直接双击 HTML 文件预览，也不要把整个源码目录或 node_modules 当作静态目录公开。

## 页面与功能边界

| 页面                             | 演示能力                                     |
| -------------------------------- | -------------------------------------------- |
| 首页 `/`                         | 轮播、推荐、目录排序与分页                   |
| 分类 `/category/旅行/`           | 分类与排序                                   |
| 排行榜 `/ranking/`               | 分类与排名排序                               |
| 搜索 `/search/`                  | 本地关键词与分类过滤                         |
| 详情 `/series/demo-01/`          | 虚构简介、选集、本机收藏                     |
| 播放 `/play/episode/demo-01-01/` | Canvas 动画播放/暂停、选集，不是视频流播放器 |
| 收藏 `/account/`                 | 当前浏览器 localStorage 收藏                 |
| 声明 `/about/`                   | 许可、来源及合规说明                         |

没有真实注册、登录、支付、充值、订单、上传、广告投放或统计上报。评分、条目、集数均为虚构数据；全部条目免费，播放器共用原创几何动画，无第三方影视片源。

## 二次开发

- `src/data/catalog.json`：演示目录与分集。
- `public/posters/`：原创几何封面。
- `src/components/`：用户端组件，`DemoPlayer.tsx` 为动画演示。
- `src/app/`：页面路由与样式。
- `src/lib/demo-catalog.ts`：本地筛选与分页。

增加条目或分类后重新构建，动态路径由 generateStaticParams 在构建时生成。此版有意移除了后端对接层，接入真实服务需自行实现 API、鉴权、安全校验及错误处理，不能把浏览器收藏状态用作服务端权限依据。欢迎 Fork、修改及提交改进。

## PeerTube 参考说明

功能与产品思路参考 [PeerTube](https://joinpeertube.org/) 开源项目，**未使用其源码**。不是 PeerTube 的分支、衍生发行版或兼容客户端，与 PeerTube、Framasoft 无官方关联、合作或背书。未来引入其代码，应遵守对应许可证，不能用本仓库 MIT 声明替代。详见 [第三方声明](THIRD_PARTY_NOTICES.md)。

## 使用、版权与责任声明

本项目主要用于学习与实现参考。“仅供学习”不构成对侵权或违法行为的许可，不能免除任何主体依法应承担的责任。

1. 不得用于传播盗版、违法内容、非法收集个人信息或绕过第三方访问控制。使用真实视频、音频、封面、字幕、字体、商标和肖像前，应取得覆盖相应用途的合法授权。
2. 实际部署及运营者应遵守相关地区法律，核实适用的备案、经营许可、内容审核、未成年人保护及消费者权益要求，对外运营应另行提供用户协议、隐私政策和投诉渠道。
3. 应用代码不接入业务、广告或统计 API，收藏仅保存演示条目编号到当前浏览器 localStorage，可取消收藏或清除站点数据。静态托管服务仍可能按其政策处理访问日志；本说明不替代真实运营服务的隐私政策。
4. 软件按现状提供。保证与责任限制以 [MIT 许可证](LICENSE) 及适用法律为准，依法不得排除或限制的责任不受影响。代码许可不等于内容授权、经营许可或合规认证。
5. 认为本仓库代码或素材侵权，请通过 [Issues](https://github.com/hxonhuangxiaoxun-blip/vidnest-ky/issues) 提供文件路径、问题概况及非敏感权利依据。勿公开身份证件、完整合同、密钥或用户资料。维护者应依法核实并采取必要措施。

## 静态部署

已附带 [可直接部署的静态 ZIP](downloads/vidnest-frontend-static.zip)（点击文件页的 Download raw file 下载），校验值见 [SHA256SUMS](downloads/SHA256SUMS.txt)。此包按站点根路径构建，解压后按 DEPLOY.txt 部署。仓库子路径托管请使用下方 Pages 工作流重新构建。


可在 GitHub Actions 中手动运行 `Build frontend`，下载 `vidnest-frontend-static` 产物，解压后部署其中的内容到支持目录 index.html 的静态主机。

仓库提供可选的 `Deploy GitHub Pages` 工作流。管理员先在 Settings → Pages 将 Source 设为 GitHub Actions，再手动运行；该工作流自动按仓库子路径构建。其他主机通常直接部署默认构建的 out 目录。自行部署到子路径时，设置 `NEXT_PUBLIC_BASE_PATH=/vidnest-ky` 后重新构建。

构建产物无需提交 node_modules 或 .next。演示版验证不代表原项目三端或真实业务链路验收。
