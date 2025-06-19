import { FC, useState, useEffect, ReactNode } from 'react';
import './index.css';
import { FaGithub } from 'react-icons/fa';
import SEO from '../../common/SEO';
import ScrollToTopButton from '../../common/ScrollToTopButton';

// --- Data ---
const personalInfo = {
  title: "关于我",
  subtitle: "热爱技术，追求创新",
  intro: "我是一名充满热情的前端开发工程师，专注于现代Web技术和云计算领域。 在过去的3年里，我参与了多个大型项目的开发，积累了丰富的实战经验。 我热衷于学习新技术，并善于将技术转化为解决实际问题的方案。",
  stats: [
    { number: "3+", label: "年开发经验" },
    { number: "20+", label: "项目经验" },
    { number: "5+", label: "技术领域" },
  ],
};

const contactInfo = [
  { type: 'email', href: 'mailto:2667534364@qq.com', icon: '📧', label: 'Email' },
  { type: 'github', href: 'https://github.com/LambdaJoker', icon: <FaGithub />, label: 'GitHub' },
  { type: 'linkedin', href: 'https://linkedin.com/in/yourusername', icon: '💼', label: 'LinkedIn' },
];

const workExperience = [
  {
    date: '2026 - 至今',
    title: '前端开发工程师',
    company: '某科技公司',
    achievements: [
      '负责公司前端开发',
      '带领团队完成多个重要项目的交付',
      '优化系统性能，提升用户体验',
    ],
  },
];

const educationInfo = {
  degree: '数据科学与大数据技术',
  school: '东华理工大学',
  period: '2022 - 2026',
  courses: '主修课程：数据结构、算法分析、计算机网络、操作系统、数据库系统、爬虫、HBase、Hive、Hadoop等',
};

const certificates = [
  { icon: '📜', title: '第六届人工智能算法大赛', subtitle: '国家三等奖', date: '2024年获得' },
  { icon: '🏆', title: 'CET-4', date: '2023年获得' },
  { icon: '🎯', title: 'CET-6', date: '2025年获得' },
  { icon: '💻', title: '计算机三级数据库技术', date: '2025年获得' },
];

const strengths = [
  { icon: '🚀', title: '快速学习', description: '善于学习新技术，快速适应新环境' },
  { icon: '🤝', title: '团队协作', description: '良好的沟通能力，擅长团队协作' },
  { icon: '💡', title: '问题解决', description: '善于分析和解决复杂问题' },
  { icon: '🎯', title: '项目管理', description: '具备项目规划和团队管理经验' },
  { icon: '🔍', title: '技术钻研', description: '对技术有浓厚兴趣，持续学习新知识' },
  { icon: '🌐', title: '全栈开发', description: '前后端技术全面，经验丰富' },
];

const interests = [
  { icon: '📚', title: '技术阅读', description: '关注技术发展动态，阅读技术博客和书籍' },
  { icon: '🎮', title: '游戏开发', description: '业余时间研究游戏开发，热爱创造' },
  { icon: '🎨', title: 'UI 设计', description: '关注用户体验，学习界面设计' },
  { icon: '✍️', title: '技术写作', description: '分享技术经验，撰写技术文章' },
];

// --- Section Components ---

const Section: FC<{ title?: string; children: ReactNode, className?: string }> = ({ title, children, className }) => (
  <section className={className}>
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

const PersonalInfoSection: FC = () => (
  <Section className="about-header">
    <h1>{personalInfo.title}</h1>
    <p className="subtitle">{personalInfo.subtitle}</p>
    <div className="intro-text">
      <p>{personalInfo.intro}</p>
    </div>
    <div className="profile-stats">
      {personalInfo.stats.map(stat => (
        <div className="stat-item" key={stat.label}>
          <span className="stat-number">{stat.number}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  </Section>
);

const ContactSection: FC = () => (
  <Section title="联系方式" className="contact-section">
    <div className="contact-grid">
      {contactInfo.map(contact => (
        <a href={contact.href} className="contact-item" key={contact.type}>
          <span className="contact-icon">{contact.icon}</span>
          <span>{contact.label}</span>
        </a>
      ))}
    </div>
  </Section>
);

const ExperienceSection: FC = () => (
  <Section title="工作经历" className="experience-section">
    <div className="timeline">
      {workExperience.map((job, index) => (
        <div className="timeline-item" key={index}>
          <div className="timeline-date">{job.date}</div>
          <div className="timeline-content">
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
            <ul className="achievements">
              {job.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const EducationSection: FC = () => (
  <Section title="教育背景" className="education-section">
    <div className="education-card">
      <h3>{educationInfo.degree}</h3>
      <p className="school">{educationInfo.school}</p>
      <p className="period">{educationInfo.period}</p>
      <p className="description">{educationInfo.courses}</p>
    </div>
  </Section>
);

const CertificatesSection: FC = () => (
  <Section title="获奖经历&技能证书" className="certificates-section">
    <div className="certificates-grid">
      {certificates.map((cert, index) => (
        <div className="certificate-card" key={index}>
          <div className="certificate-icon">{cert.icon}</div>
          <h3>{cert.title}</h3>
          {cert.subtitle && <h3>{cert.subtitle}</h3>}
          <p className="certificate-date">{cert.date}</p>
        </div>
      ))}
    </div>
  </Section>
);

const StrengthsSection: FC = () => (
  <Section title="个人特长" className="strengths-section">
    <div className="strengths-grid">
      {strengths.map(strength => (
        <div className="strength-card" key={strength.title}>
          <div className="strength-icon">{strength.icon}</div>
          <h3>{strength.title}</h3>
          <p>{strength.description}</p>
        </div>
      ))}
    </div>
  </Section>
);

const InterestsSection: FC = () => (
  <Section title="兴趣爱好" className="interests-section">
    <div className="interests-grid">
      {interests.map(interest => (
        <div className="interest-item" key={interest.title}>
          <span className="interest-icon">{interest.icon}</span>
          <span>{interest.title}</span>
          <p className="interest-desc">{interest.description}</p>
        </div>
      ))}
    </div>
  </Section>
);

// --- Main Component ---

const AboutContent: FC = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    document.querySelectorAll('.about-container section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <>
      <SEO
        title="关于我 - 我的个人博客"
        description="了解我的个人经历、技术背景和职业规划"
        keywords="个人简介,技术博客,全栈开发,个人经历"
      />
      <div className={`about-container ${isAnimated ? 'animated' : ''}`}>
        <PersonalInfoSection />
        <ContactSection />
        <ExperienceSection />
        <EducationSection />
        <CertificatesSection />
        <StrengthsSection />
        <InterestsSection />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default AboutContent; 