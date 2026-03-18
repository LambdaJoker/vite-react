/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: app
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-06-19 10:12:38
 */
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useAppStore from './components/store/appStore'; // 确认路径正确
import Header from './components/home/Header';
import Footer from './components/common/Footer';
import SkeletonLoader from './components/skeletonLoader';
import DynamicBackground from './components/common/DynamicBackground';
import ClickEffect from './components/common/ClickEffect';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';

// 懒加载所有页面级组件
const HomePage = lazy(() => import('./components/home/HomePage'));
const ArticleList = lazy(() => import('./components/articles/ArticleList'));
const ArticleDetail = lazy(() => import('./components/articles/ArticleDetail'));
const ArticleForm = lazy(() => import('./components/articles/ArticleForm'));
const ProjectsContent = lazy(() => import('./components/projects/ProjectsContent'));
const SkillsContent = lazy(() => import('./components/skills/SkillsContent'));
const AboutContent = lazy(() => import('./components/about/AboutContent'));

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    style={{ width: '100%', position: 'relative' }}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const { fetchAppConfig, isReadOnly, isLoading } = useAppStore();

  useEffect(() => {
    fetchAppConfig();
  }, [fetchAppConfig]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <ClickEffect />
        <DynamicBackground />
        <Header />
        <main id="main-content" className="main-content" tabIndex={-1}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="page-loader"><SkeletonLoader type="card" count={3} /></div>
            ) : (
              <Suspense fallback={<div className="page-loader"><SkeletonLoader type="card" count={3} /></div>}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <AnimatedRoute>
                        <HomePage />
                      </AnimatedRoute>
                    }
                  />
                  <Route
                    path="/articles"
                    element={
                      <AnimatedRoute>
                        <ArticleList />
                      </AnimatedRoute>
                    }
                  />
                  <Route
                    path="/articles/:id"
                    element={
                      <AnimatedRoute>
                        <ArticleDetail />
                      </AnimatedRoute>
                    }
                  />
                  {/* 只有在非只读模式下才渲染创建和编辑的路由 */}
                  {!isReadOnly && (
                    <>
                      <Route
                        path="/articles/new"
                        element={
                          <AnimatedRoute>
                            <ArticleForm mode="create" />
                          </AnimatedRoute>
                        }
                      />
                      <Route
                        path="/articles/:id/edit"
                        element={
                          <AnimatedRoute>
                            <ArticleForm mode="edit" />
                          </AnimatedRoute>
                        }
                      />
                    </>
                  )}
                  <Route path="/projects" element={<AnimatedRoute><ProjectsContent /></AnimatedRoute>} />
                  <Route path="/skills" element={<AnimatedRoute><SkillsContent /></AnimatedRoute>} />
                  <Route path="/about" element={<AnimatedRoute><AboutContent /></AnimatedRoute>} />
                </Routes>
              </Suspense>
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
