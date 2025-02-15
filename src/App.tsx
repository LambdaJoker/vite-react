/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-02-15 14:49:07
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
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <ErrorBoundary>
            <Switch>
              <Route exact path="/" component={HomeContent} />
              <Route path="/articles" exact component={ArticleList} />
              <Route path="/articles/:id" component={ArticleDetail} />
              <Route path="/projects" component={ProjectsContent} />
              <Route path="/skills" component={SkillsContent} />
              <Route path="/about" component={AboutContent} />
            </Switch>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
};

export default App;
