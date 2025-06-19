/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: app
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-06-19 08:25:09
 */
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useAppStore from './components/store/appStore'; // 确认路径正确
import Header from './components/home/Header';
import SkeletonLoader from './components/skeletonLoader';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';

// 懒加载所有页面级组件
const HomeContent = lazy(() => import('./components/home/HomeContent'));
const ArticleList = lazy(() => import('./components/articles/ArticleList'));
const ArticleDetail = lazy(() => import('./components/articles/ArticleDetail'));
const ArticleForm = lazy(() => import('./components/articles/ArticleForm'));
const ProjectsContent = lazy(() => import('./components/projects/ProjectsContent'));
const SkillsContent = lazy(() => import('./components/skills/SkillsContent'));
const AboutContent = lazy(() => import('./components/about/AboutContent'));

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    transition={{ duration: 0.3 }}
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
    <Router>
      <div className="app">
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
                        <HomeContent />
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
                  <Route
                    path="/projects"
                    element={
                      <AnimatedRoute>
                        <ProjectsContent />
                      </AnimatedRoute>
                    }
                  />
                  <Route
                    path="/skills"
                    element={
                      <AnimatedRoute>
                        <SkillsContent />
                      </AnimatedRoute>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <AnimatedRoute>
                        <AboutContent />
                      </AnimatedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
};

export default App;
