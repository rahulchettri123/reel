// src/components/comments/CommentCard.tsx

import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Star } from 'lucide-react';
import { MovieComment } from '../../services/comments';

interface CommentCardProps {
  comment: MovieComment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const navigate = useNavigate();
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Card className="mb-4 bg-dark text-light">
      <Card.Body>
        <Row className="align-items-start">
          {/* User Info */}
          <Col xs="auto">
            <img
              src={comment.userAvatar}
              alt={comment.userName}
              className="rounded-circle"
              width="40"
              height="40"
            />
          </Col>
          <Col>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-0">{comment.userName}</h6>
                <small className="text-muted">
                  commented on {comment.movieTitle} • {formatTimestamp(comment.timestamp)}
                </small>
              </div>
              <Badge bg="primary" className="d-flex align-items-center gap-1">
                <Star size={14} /> {comment.rating}/5
              </Badge>
            </div>
          </Col>
        </Row>

        {/* Movie Preview */}
        <div 
          className="mt-3 position-relative movie-preview"
          onClick={() => navigate(`/reel-critic/movies/${comment.movieId}`)}
          style={{ cursor: 'pointer' }}
        >
          <Row>
            <Col xs={4} md={3}>
              <img
                src={comment.movieImage}
                alt={comment.movieTitle}
                className="img-fluid rounded"
              />
            </Col>
            <Col xs={8} md={9}>
              <h5>{comment.movieTitle}</h5>
              <p className="mb-0">{comment.comment}</p>
            </Col>
          </Row>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 d-flex gap-4">
          <button className="btn btn-link text-light p-0 d-flex align-items-center gap-2">
            <Heart size={18} /> {comment.likes}
          </button>
          <button className="btn btn-link text-light p-0 d-flex align-items-center gap-2">
            <MessageSquare size={18} /> Reply
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};