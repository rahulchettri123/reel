import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Star } from 'lucide-react';
import { reviewAPI, authAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from './MovieContext';

interface ReviewFormProps {
  movieId: string | number;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewSubmitted }) => {
  const navigate = useNavigate();
  const { fetchMovieData, addReview } = useMovieContext();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Check if user is logged in
  const isLoggedIn = authAPI.isLoggedIn();
  const currentUser = authAPI.getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !currentUser) {
      navigate('/reel-critic/account/login');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter a review');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const reviewData = {
        userId: currentUser.id,
        movieId: Number(movieId),
        rating,
        content,
        date: new Date().toISOString().split('T')[0],
        likes: [],
        comments: []
      };
      
      const createdReview = await reviewAPI.createReview(reviewData);
      
      // Add user details to the review
      const reviewWithUser = {
        ...createdReview,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          profilePicture: currentUser.profilePicture || 'https://via.placeholder.com/150'
        }
      };
      
      // Add the new review to the context
      addReview(reviewWithUser);
      
      // Reset form
      setRating(0);
      setContent('');
      
      // Notify parent component
      onReviewSubmitted();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={24}
          fill={(hoverRating || rating) >= i ? "#ffc107" : "none"}
          color="#ffc107"
          className={`me-1 cursor-pointer ${rating === i ? 'star-animation' : ''}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return stars;
  };

  if (!isLoggedIn) {
    return (
      <Alert variant="info">
        <Alert.Heading>Want to leave a review?</Alert.Heading>
        <p>
          Please <Button variant="link" className="p-0" onClick={() => navigate('/reel-critic/account/login')}>log in</Button> to leave a review.
        </p>
      </Alert>
    );
  }

  return (
    <Card className="bg-dark text-light mb-4 review-form-card">
      <Card.Body className="p-3 p-md-4">
        <h4 className="mb-3">Write Your Review</h4>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Your Rating</Form.Label>
            <div className="d-flex align-items-center mb-2 star-rating">
              {renderStars()}
              <span className="ms-2">{rating > 0 ? `${rating}/5` : 'Select a rating'}</span>
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Share your thoughts about this movie..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-dark-secondary text-light"
              disabled={submitting}
            />
          </Form.Group>
          
          <Row className="mt-4">
            <Col>
              <Button 
                type="submit" 
                variant="danger"
                disabled={submitting}
                className="px-4"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm; 