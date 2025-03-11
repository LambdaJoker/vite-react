/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: app
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-03-11 15:00:47
 */
/** @jsx React.createElement */
/** @jsxImportSource react */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/home/Header';
import HomeContent from './components/home/HomeContent';
import ArticleList from './components/articles/ArticleList';
import ArticleDetail from './components/articles/ArticleDetail';
import ProjectsContent from './components/projects/ProjectsContent';
import SkillsContent from './components/skills/SkillsContent';
import AboutContent from './components/about/AboutContent';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main id="main-content" className="main-content" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <Switch>
              <Route exact path="/">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomeContent />
                </motion.div>
              </Route>
              <Route path="/articles" exact component={ArticleList} />
              <Route path="/articles/:id" component={ArticleDetail} />
              <Route path="/projects" component={ProjectsContent} />
              <Route path="/skills" component={SkillsContent} />
              <Route path="/about" component={AboutContent} />
            </Switch>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
};

export default App;
