/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: app
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-06-19 10:12:38
 */
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import useAppStore from './components/store/appStore';
import Header from './components/home/Header';
import Footer from './components/common/Footer';
import SkeletonLoader from './components/skeletonLoader';
import DynamicBackground from './components/common/DynamicBackground';
import ClickEffect from './components/common/ClickEffect';
import './App.css';

const HomePage = lazy(() => import('./components/home/HomePage'));
const ArticleList = lazy(() => import('./components/articles/ArticleList'));
const ArticleDetail = lazy(() => import('./components/articles/ArticleDetail'));
const ArticleForm = lazy(() => import('./components/articles/ArticleForm'));
const Archive = lazy(() => import('./components/articles/Archive'));
const ProjectsContent = lazy(() => import('./components/projects/ProjectsContent'));
const BookmarksContent = lazy(() => import('./components/bookmarks/BookmarksContent'));
const ThoughtsContent = lazy(() => import('./components/thoughts/ThoughtsContent'));
const ActivatePage = lazy(() => import('./components/simlife/ActivatePage'));
const AdminCardsPage = lazy(() => import('./components/simlife/AdminCardsPage'));

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <div className="route-view">
    {children}
  </div>
);

const MainApp: React.FC = () => {
  const { fetchAppConfig, isReadOnly } = useAppStore();
  const location = useLocation();
  const isStandalone = location.pathname.startsWith('/activate') || location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchAppConfig();
  }, [fetchAppConfig]);

  return (
    <div className="app">
      <ClickEffect />
      <DynamicBackground />
      {!isStandalone ? <Header /> : null}
      <main
        id="main-content"
        className="main-content"
        tabIndex={-1}
        style={isStandalone ? { paddingTop: 0, minHeight: '100vh' } : undefined}
      >
        <Suspense fallback={<div className="page-loader"><SkeletonLoader type="card" count={3} /></div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
            <Route path="/articles" element={<AnimatedRoute><ArticleList /></AnimatedRoute>} />
            <Route path="/articles/:id" element={<AnimatedRoute><ArticleDetail /></AnimatedRoute>} />
            <Route path="/archive" element={<AnimatedRoute><Archive /></AnimatedRoute>} />
            {!isReadOnly && (
              <>
                <Route path="/articles/new" element={<AnimatedRoute><ArticleForm mode="create" /></AnimatedRoute>} />
                <Route path="/articles/:id/edit" element={<AnimatedRoute><ArticleForm mode="edit" /></AnimatedRoute>} />
              </>
            )}
            <Route path="/projects" element={<AnimatedRoute><ProjectsContent /></AnimatedRoute>} />
            <Route path="/bookmarks" element={<AnimatedRoute><BookmarksContent /></AnimatedRoute>} />
            <Route path="/thoughts" element={<AnimatedRoute><ThoughtsContent /></AnimatedRoute>} />
            <Route path="/activate" element={<AnimatedRoute><ActivatePage /></AnimatedRoute>} />
            <Route path="/activate/search" element={<AnimatedRoute><ActivatePage /></AnimatedRoute>} />
            <Route path="/activate/:deviceCode" element={<AnimatedRoute><ActivatePage /></AnimatedRoute>} />
            <Route path="/admin/cards" element={<AnimatedRoute><AdminCardsPage /></AnimatedRoute>} />
          </Routes>
        </Suspense>
      </main>
      {!isStandalone ? <Footer /> : null}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MainApp />
    </Router>
  );
};

export default App;
