import { FC, useEffect, useState, useRef } from 'react';
import useAppStore from '../../store/appStore';
import './index.css';
import bgVideo from '../../../assets/video/bg-video.mp4';

const DynamicBackground: FC = () => {
  const [bgUrl, setBgUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const { bgMode } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchWallpaper = async () => {
    if (bgMode === 'static' && !isMobile) {
      setBgUrl(''); // 清空 bgUrl 以便显示视频
      return;
    }
    
    // 如果是移动端，或者模式为 dynamic，都去获取图片
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      // 添加时间戳以防止浏览器缓存 GET 请求，确保每次刷新或轮询都能拿到新的随机背景
      const res = await fetch(`${baseUrl}/api/wallpapers/random?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && data.data.url) {
        // 如果后端返回的是相对路径，且不是前端 public 目录下的静态视频，则补全域名
        let finalUrl = data.data.url;
        if (finalUrl.startsWith('/') && finalUrl !== '/bg-video.mp4') {
          finalUrl = `${baseUrl}${finalUrl}`;
        }
        setBgUrl(finalUrl);
      }
    } catch (err) {
      console.error('Failed to fetch wallpaper:', err);
    }
  };

  useEffect(() => {
    fetchWallpaper();
    
    // Refresh every 5 minutes (300,000 ms) only for dynamic
    const intervalId = setInterval(() => {
      // 只有在 dynamic 模式下，或者（静态模式但为移动端）时才需要轮询壁纸
      const currentBgMode = useAppStore.getState().bgMode;
      if (currentBgMode === 'dynamic' || (currentBgMode === 'static' && isMobile)) {
        fetchWallpaper();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [bgMode, isMobile]);

  useEffect(() => {
    if (bgMode === 'static' && !isMobile && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Auto-play was prevented:", error);
      });
    }
  }, [bgMode, isMobile]);

  return (
    <>
      {bgMode === 'static' && !isMobile ? (
        <div className="dynamic-background video-background">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            className="bg-video"
            poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            style={{ backgroundColor: 'transparent' }}
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        </div>
      ) : (
        bgUrl && (
          bgUrl.endsWith('.mp4') || bgUrl.endsWith('.webm') ? (
            <div className="dynamic-background video-background">
              <video 
                key={bgUrl} /* 使用 key 强制重新渲染 video 元素加载新源 */
                autoPlay 
                loop 
                muted 
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                className="bg-video"
                poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                style={{ backgroundColor: 'transparent' }}
              >
                <source src={bgUrl} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div 
              className="dynamic-background image-background"
              style={{ backgroundImage: `url(${bgUrl})` }}
            />
          )
        )
      )}
    </>
  );
};

export default DynamicBackground;
