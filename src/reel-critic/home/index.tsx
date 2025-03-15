// src/reel-critic/home/index.tsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Stories from './Stories';
import PostFeed from './PostFeed';
import TrendingPosts from './TrendingPosts';
import './index.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Container>
        <div className="stories-wrapper">
          <Stories />
        </div>
        <Row>
          <Col lg={8} className="content-main">
            <PostFeed />
          </Col>
          <Col lg={4} className="content-sidebar">
            <TrendingPosts />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;