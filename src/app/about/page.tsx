import { PageFrame } from "@/components/AppShell";
export default function Page() {
  return (
    <PageFrame>
      <article className="demo-content demo-legal">
        <h1>学习、许可与使用声明</h1>
        <h2>纯前端演示</h2>
        <p>
          本项目供学习、技术研究与二次开发参考，采用 MIT
          许可证。可以使用、修改和再分发代码，须保留版权及许可声明。MIT
          允许商业使用，但不授予第三方内容权利或经营资质。
        </p>
        <h2>PeerTube 参考说明</h2>
        <p>
          功能与产品思路参考
          PeerTube，未使用其源码，不是其分支、衍生发行版或兼容客户端，与
          PeerTube、Framasoft
          无官方关联或背书。未来引入其代码须另行遵守对应许可。
        </p>
        <h2>数据与素材</h2>
        <p>
          条目、评分与集数均为虚构数据，几何封面及 Canvas
          动画由本仓库生成。没有影视片源、真实账号或支付服务。
        </p>
        <h2>隐私与存储</h2>
        <p>
          应用代码不接入业务
          API、广告或统计服务。收藏仅将演示条目编号保存到浏览器
          localStorage，可取消收藏或清除站点数据。静态托管服务可能依其政策处理访问日志；本说明不替代真实运营服务的隐私政策。
        </p>
        <h2>合法使用与责任边界</h2>
        <p>
          不得用于盗版传播、非法收集个人信息或其他违法行为。实际部署、内容授权、备案许可和运营义务由相关主体依法履行。软件按现状提供，保证与责任限制以
          MIT 许可证及适用法律为准；“仅供学习”不能免除法定责任。
        </p>
        <p>
          仓库代码或素材问题请通过{" "}
          <a href="https://github.com/hxonhuangxiaoxun-blip/vidnest-ky/issues">
            GitHub Issues
          </a>{" "}
          提供非敏感反馈，勿公开身份证件、密钥或个人资料。
        </p>
      </article>
    </PageFrame>
  );
}
