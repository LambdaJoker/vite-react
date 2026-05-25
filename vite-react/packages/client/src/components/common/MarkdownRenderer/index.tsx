import { FC, useState, useMemo, useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import RMD from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LazyImage from '../../lazyImage';
import 'katex/dist/katex.min.css';
import './index.css';

const ReactMarkdown = (RMD as any).default || RMD;

const markdownRemarkPlugins = [remarkGfm, remarkMath];
const markdownRehypePlugins = [rehypeKatex, rehypeRaw];

interface MarkdownRendererProps {
  children: string;
}

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: FC<MermaidDiagramProps> = ({ chart }) => {
  const reactId = useId();
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      setError('');
      setSvg('');

      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default'
        });

        const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(diagramId, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('Mermaid render failed:', err);
        if (isMounted) {
          setError('图表渲染失败，已保留原始代码。');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="mermaid-error">
        <p>{error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div className="mermaid-loading">图表渲染中...</div>;
  }

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ children }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if the click should just open the link naturally (e.g. holding Ctrl/Cmd)
    if (e.ctrlKey || e.metaKey) return;

    if (!href) return;

    const isImageApi = 
      href.includes('unsplash.com') || 
      href.includes('picsum.photos') ||
      href.includes('dog.ceo') || 
      href.includes('thecatapi') || 
      href.includes('haowallpaper.com') || 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(href);

    const isTextApi = 
      href.includes('hitokoto.cn') || 
      href.includes('xygeng.cn') || 
      href.includes('official-joke-api');

    if (isImageApi) {
      e.preventDefault();
      setIsLoading(true);
      setPreviewImage(null); // Reset
      setPreviewText(null);
      try {
        if (href.includes('dog.ceo')) {
          const res = await fetch(href).then(r => r.json());
          setPreviewImage(res.message);
        } else if (href.includes('thecatapi')) {
          const res = await fetch(href).then(r => r.json());
          setPreviewImage(res[0]?.url || '');
        } else {
          setPreviewImage(href);
        }
      } catch (err) {
        console.error('Failed to load image preview:', err);
        setPreviewText('无法加载图片预览，请直接访问链接。');
      } finally {
        setIsLoading(false);
      }
    } else if (isTextApi) {
      e.preventDefault();
      setIsLoading(true);
      setPreviewImage(null);
      setPreviewText(null);
      try {
        const res = await fetch(href, { headers: { 'Accept': 'application/json' } }).then(r => r.json());
        if (href.includes('hitokoto.cn')) {
          setPreviewText(`「${res.hitokoto}」 —— ${res.from}`);
        } else if (href.includes('xygeng.cn')) {
          const dataContent = res.data?.content || res.content || res.data?.text || res.text;
          setPreviewText(dataContent ? `「${dataContent}」` : JSON.stringify(res, null, 2));
        } else if (href.includes('official-joke-api')) {
          setPreviewText(`Q: ${res.setup}\nA: ${res.punchline}`);
        } else {
          setPreviewText(JSON.stringify(res, null, 2));
        }
      } catch (err) {
        console.error('Failed to load text preview:', err);
        setPreviewText('无法加载内容，请直接访问链接。');
      } finally {
        setIsLoading(false);
      }
    }
    // 否则放行默认的 a 标签跳转行为
  }, []);

  const markdownComponents = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match?.[1]?.toLowerCase();
      const codeValue = String(children).replace(/\n$/, '');

      if (!inline && language === 'mermaid') {
        return <MermaidDiagram chart={codeValue} />;
      }

      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          PreTag="div"
          {...props}
        >
          {codeValue}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a({ node, href, children, ...props }: any) {
      return (
        <a 
          href={href} 
          onClick={(e) => handleLinkClick(e, href)} 
          className="interactive-link"
          title="点击预览"
          {...props}
        >
          {children}
        </a>
      );
    },
    img({ node, src, alt, ...props }: any) {
      if (!src) return null;
      return (
        <span className="markdown-image-wrapper">
          <LazyImage
            src={src}
            alt={alt || ''}
            className="markdown-image"
            fetchPriority="low"
            rootMargin="360px 0px"
          />
        </span>
      );
    }
  }), [handleLinkClick]);

  return (
    <>
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
        components={markdownComponents}
      >
        {children}
      </ReactMarkdown>

      {/* Preview Modals using Portal */}
      {(previewImage || previewText || isLoading) && createPortal(
        <div className="preview-modal-overlay" onClick={() => {
          setPreviewImage(null);
          setPreviewText(null);
        }}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
            <button className="preview-close-btn" onClick={() => {
              setPreviewImage(null);
              setPreviewText(null);
            }}>×</button>
            
            {isLoading ? (
              <div className="preview-loading">加载中...</div>
            ) : previewImage ? (
              <img src={previewImage} alt="Preview" className="preview-image" />
            ) : previewText ? (
              <div className="preview-text-container">
                <p>{previewText}</p>
              </div>
            ) : null}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MarkdownRenderer; 
