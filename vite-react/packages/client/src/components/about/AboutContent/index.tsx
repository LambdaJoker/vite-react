import { FC, ReactNode } from 'react';
import './index.css';
import SEO from '../../common/SEO';
import ScrollToTopButton from '../../common/ScrollToTopButton';

// --- Data ---
const setupInfo = {
  title: "工作台 & 装备库",
  subtitle: "工欲善其事，必先利其器",
  intro: "这里记录了我日常开发所使用的硬件设备、软件工具以及工作流。一个舒适、高效的开发环境是保持编码热情的关键。",
};

const hardwareSetup = [
  {
    category: "电脑设备",
    items: [
      { name: "MacBook Pro 14\"", desc: "M2 Pro / 16GB / 512GB - 主力开发机，性能与续航的完美平衡" },
      { name: "LG 27寸 4K 显示器", desc: "Type-C 一线连，色彩准确，提升代码阅读体验" }
    ]
  },
  {
    category: "外设与配件",
    items: [
      { name: "Keychron K3 Pro", desc: "矮轴机械键盘，红轴，手感轻盈，适合长时间打字" },
      { name: "Logitech MX Master 3S", desc: "无极滚轮在浏览长代码文件时非常顺滑" },
      { name: "Bose 降噪耳机", desc: "屏蔽环境噪音，进入沉浸式心流状态必备" }
    ]
  }
];

const softwareSetup = [
  {
    category: "开发工具 (IDE & 编辑器)",
    items: [
      { name: "VS Code / Cursor", desc: "日常前端与 Node.js 开发的主力编辑器，配置了常用的效率插件" },
      { name: "WebStorm", desc: "在处理大型复杂前端项目时的备用选择，重构和代码提示更强大" }
    ]
  },
  {
    category: "终端与命令行",
    items: [
      { name: "iTerm2 + Zsh + Oh My Zsh", desc: "高颜值、高效率的终端组合" },
      { name: "Homebrew", desc: "macOS 上的包管理神器" },
      { name: "Git", desc: "版本控制，习惯使用命令行结合部分 GUI 工具 (如 SourceTree)" }
    ]
  },
  {
    category: "效率与设计",
    items: [
      { name: "Raycast", desc: "替代 Spotlight 的启动器，集成了丰富的快捷指令和剪贴板历史" },
      { name: "Figma", desc: "UI/UX 设计、切图以及简单的矢量绘图" },
      { name: "Notion", desc: "记录灵感、项目规划以及知识库管理" }
    ]
  }
];

// --- Section Components ---

const Section: FC<{ title?: string; children: ReactNode, className?: string }> = ({ title, children, className }) => (
  <section className={className}>
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

const SetupHeader: FC = () => (
  <Section className="about-header">
    <h1>{setupInfo.title}</h1>
    <p className="subtitle">{setupInfo.subtitle}</p>
    <div className="intro-text">
      <p>{setupInfo.intro}</p>
    </div>
  </Section>
);

const SetupList: FC<{ title: string; data: typeof hardwareSetup }> = ({ title, data }) => (
  <Section title={title} className="setup-section">
    <div className="setup-grid">
      {data.map((group, index) => (
        <div key={index} className="setup-card">
          <h3 className="setup-category">{group.category}</h3>
          <ul className="setup-items">
            {group.items.map((item, idx) => (
              <li key={idx}>
                <strong>{item.name}</strong>
                <p>{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);

const AboutContent: FC = () => {
  return (
    <>
      <SEO 
        title="装备库 | TAO" 
        description="前端开发工程师的日常开发环境、硬件设备与软件工具推荐。" 
      />
      <div className="about-container animated">
        <SetupHeader />
        
        <SetupList title="💻 硬件外设" data={hardwareSetup} />
        <SetupList title="🛠️ 软件与工具" data={softwareSetup} />
        
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default AboutContent;
